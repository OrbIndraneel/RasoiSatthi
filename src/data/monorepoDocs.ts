export interface CodeFile {
  path: string;
  language: string;
  description: string;
  content: string;
}

export const MONOREPO_STRUCTURE = {
  name: "rasoisaathi-monorepo",
  children: [
    {
      name: "apps",
      children: [
        { name: "mobile (Expo React Native 51, TS, NativeWind, WatermelonDB)" },
        { name: "backend (Fastify Nesting, PostgreSQL RDS, DynamoDB, OpenSearch)" }
      ]
    },
    {
      name: "packages",
      children: [
        { name: "shared-types (Shared models & i18n configurations)" },
        { name: "ui-kit (Tailwind NativeWind accessible components)" }
      ]
    },
    {
      name: "infra",
      children: [
        { name: "cdk (AWS Typescript CDK Stacks)" }
      ]
    },
    {
      name: "seed",
      children: [
        { name: "region-recipes.json (500 Curated diverse Indian culinary cards)" }
      ]
    }
  ]
};

export const DOCS_CODE_FILES: CodeFile[] = [
  {
    path: "infra/lib/rasoi-saathi-stack.ts",
    language: "typescript",
    description: "AWS CDK Construct provisioning secure VPC, RDS, DynamoDB, and Auto-scaling ECS Fargate task with IAM least-privilege policies.",
    content: `import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class RasoiSaathiStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. VPC with Public & Isolate/Private Subnets in Mumbai (ap-south-1)
    const vpc = new ec2.Vpc(this, 'RasoiVpc', {
      maxAzs: 3,
      subnetConfiguration: [
        { name: 'Public', subnetType: ec2.SubnetType.PUBLIC, cidrMask: 24 },
        { name: 'Private', subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS, cidrMask: 24 },
        { name: 'Isolated', subnetType: ec2.SubnetType.PRIVATE_ISOLATED, cidrMask: 24 }
      ]
    });

    // 2. PostgreSQL Relational database (RDS Serverless v2 for scaling cost-efficiency)
    const secret = new secretsmanager.Secret(this, 'RasoiDbSecret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'rasoi_admin' }),
        generateStringKey: 'password',
        excludeCharacters: '"@/\\\\'
      }
    });

    const database = new rds.DatabaseInstance(this, 'RasoiDbInstance', {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_15 }),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MICRO), // Tested on Free tier limit
      databaseName: 'rasoisaathi_db',
      credentials: rds.Credentials.fromSecret(secret),
      allocatedStorage: 20,
      maxAllocatedStorage: 100
    });

    // 3. DynamoDB table for high-frequency pantry sensor tracking
    const pantryTable = new dynamodb.Table(this, 'PantryTrackerTable', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'ingredientId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'ttl',
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });

    // 4. ECS Fargate Cluster for stable WebSockets voice interaction with Sarvam AI
    const cluster = new ecs.Cluster(this, 'RasoiVoiceCluster', { vpc });
    const voiceService = new ecs.FargateService(this, 'VoiceWebSocketService', {
      cluster,
      taskDefinition: new ecs.FargateTaskDefinition(this, 'VoiceTaskDef', {
        memoryLimitMiB: 1024,
        cpu: 512
      }),
      desiredCount: 2
    });

    // 5. Least-Privilege IAM Roles & Secrets integration
    pantryTable.grantReadWriteData(voiceService.taskDefinition.taskRole);
    secret.grantRead(voiceService.taskDefinition.taskRole);
  }
}`
  },
  {
    path: "apps/backend/prompts/intent-classifier.prompt.md",
    language: "markdown",
    description: "Multi-lingual and code-switched Indic NLP intent router parsing Hindi, English, Tamil, Telugu, Marathi inputs.",
    content: `# INDIC NLP INTENT CLASSIFIER & ROUTER

You are the query classifier and Indic Router for 'RasoiSaathi', an Indian kitchen companion. Your core job is to identify what the user wants based on bilingual or code-switched queries (e.g. Hinglish, Tanglish).

## Intent Categories:
1. **RECIPE_SEARCH**: User asking what to prepare with current ingredients, leftover ideas, or search specific recipes.
2. **SUBSTITUTE_FINDER**: User missing a core ingredient (e.g., 'tamatar khatam ho gaya') and requesting safe substitutes.
3. **EXPIRY_CHECK**: Querying which ingredients in their pantry are spoiling or how to preserve something.
4. **PREFERENCE_UPDATE**: Setting diet profiles or saying someone is diabetic.

## Examples:
### Input (Hinglish): "Bina tamatar ke paneer sabji kaise banaye?"
### Output:
{
  "intent": "SUBSTITUTE_FINDER",
  "entities": {
    "target_ingredient": "Tomato",
    "core_dish": "Paneer Sabji"
  },
  "detected_language": "Hinglish (hi-en)",
  "confidence": 0.98
}

### Input (Tamil code-switched): "Velli kizhamai special no-onion-garlic recipes kudu"
### Output:
{
  "intent": "RECIPE_SEARCH",
  "entities": {
    "tags": ["no-onion-garlic", "friday-special"]
  },
  "detected_language": "Tamilish (ta-en)",
  "confidence": 0.99
}`
  },
  {
    "path": "apps/mobile/src/shared/lib/db/WatermelonSync.ts",
    "language": "typescript",
    "description": "Offline-first database synchronization client with optimistic updates and delta-based conflict resolution.",
    "content": `import { synchronize } from '@nozbe/watermelondb/sync';
import { database } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SYNC_SERVER_URL = 'https://api.rasoisaathi.in/v1/sync';

export async function syncPantryWithCloud() {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion }) => {
      const response = await fetch(\`\${SYNC_SERVER_URL}/pull?last_pulled_at=\${lastPulledAt || 0}&schema_version=\${schemaVersion}\`, {
        headers: {
          'Authorization': \`Bearer \${await AsyncStorage.getItem('user_token')}\`
        }
      });
      if (!response.ok) throw new Error('Failed to pull delta modifications from cloud server');
      const { changes, timestamp } = await response.json();
      return { changes, timestamp };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      const response = await fetch(\`\${SYNC_SERVER_URL}/push?last_pulled_at=\${lastPulledAt}\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${await AsyncStorage.getItem('user_token')}\`
        },
        body: JSON.stringify({ changes })
      });
      if (!response.ok) throw new Error('Push syncing transaction rejected by backend gate');
    },
    migrationsEnabledAtVersion: 1
  });
}`
  },
  {
    path: "apps/mobile/src/shared/lib/DeviceOptimization.ts",
    "language": "typescript",
    "description": "India-first dynamic performance throttle, reducing GPU & network payload on low-spec Android devices.",
    "content": `import DeviceInfo from 'react-native-device-info';
import { InteractionManager } from 'react-native';

export interface PerformanceBudget {
  enableBlurhash: boolean;
  enableComplexAnimations: boolean;
  imageUploadQuality: number;
  compressedMaxKB: number;
}

export async function getPerformanceBudget(): Promise<PerformanceBudget> {
  const ramBytes = await DeviceInfo.getTotalMemory();
  const ramGB = ramBytes / (1024 * 1024 * 1024);
  const isWebRTCSupported = await DeviceInfo.isEmulator();

  // If memory is less than 1.5GB (Typical ultra-budget Indian Android phone under ₹10k)
  if (ramGB < 1.6) {
    return {
      enableBlurhash: false, 
      enableComplexAnimations: false, // Turn off Lottie and nested Reanimated spring layouts
      imageUploadQuality: 0.45, // Reduce camera footprint
      compressedMaxKB: 150
    };
  }

  // Mid-range & high-spec configuration
  return {
    enableBlurhash: true,
    enableComplexAnimations: true,
    imageUploadQuality: 0.8,
    compressedMaxKB: 450
  };
}`
  },
  {
    path: "workflows/eas-and-deploy.yml",
    language: "yaml",
    description: "GitHub Actions CI/CD pipeline building Android APK/AAV under 25MB and continuous staging AWS ECS delivery.",
    content: `name: Staging iOS & Android Multi-Build Pipeline
on:
  push:
    branches: [ main ]

jobs:
  lint-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js 20
        uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test

  eas-android-bundle:
    needs: lint-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: \${{ secrets.EXPO_PERSONAL_ACCESS_TOKEN }}
      - name: Build Android AAB with EAS (Hermes active for <25MB)
        run: |
          cd apps/mobile
          eas build --platform android --profile staging --non-interactive`
  }
];
