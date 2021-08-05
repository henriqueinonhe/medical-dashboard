export function cypressDataSelector(identifier : string) : string {
  if(process.env.TEST_ENVIRONMENT === "true") {
    return identifier;
  }

  return "";
}