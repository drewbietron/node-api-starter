import envVars from "custom-env";

export default class Environment {
  public nodeEnv: string;
  constructor(nodeEnv: string = "development") {
    this.nodeEnv = nodeEnv;
  }

  public init() {
    return envVars.env(this.nodeEnv);
  }
}
