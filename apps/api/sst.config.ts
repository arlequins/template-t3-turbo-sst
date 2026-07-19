/// <reference path="./sst-globals.d.ts" />

/** Hono API deployed as an AWS Lambda Function URL. */
export default $config({
  async app(input) {
    const { serverEnv, sstAwsRegion, Stage } = await import("@acme/env");
    const localAwsProfile = serverEnv.SST_AWS_PROFILE?.trim();
    const region = sstAwsRegion();

    return {
      name: "api",
      removal: input?.stage === Stage.PRODUCTION ? "retain" : "remove",
      protect: input?.stage === Stage.PRODUCTION,
      home: "aws",
      providers: {
        aws: {
          region,
          ...(localAwsProfile ? { profile: localAwsProfile } : {}),
        },
      },
    };
  },
  async run() {
    const { vpcFromEnv, LambdaEnvironment } = await import("@acme/env");

    const vpc = vpcFromEnv();

    const api = new sst.aws.Function("Api", {
      handler: "src/lambda.handler",
      url: true,
      ...(vpc
        ? {
            vpc: {
              subnets: vpc.subnetIds,
              securityGroups: vpc.securityGroups,
            },
          }
        : {}),
      environment: LambdaEnvironment,
    });

    return { apiUrl: api.url };
  },
});
