export default () => `
Usage: tipe <command> <flag?>

Where <command> is one of: push, offline, new, help

  push - Push your project's schema to Tipe which will update your API and Content dashboard
  flags:  -p --project - Tipe project id that this schema belongs to
          -s --schema - Path to your schema file
          -a --apikey - Tipe API key with write permission
          -d --dryrun - Won't apply any changes to your project's schema. Useful to see what changes will be applied or any conflicts
          -A --api - Tipe API endpoint url

  new - Scaffold a new basic schema for your project
  flags:  -p --port - Port for the offline API
          -s --schema - Path to your schema file

  offline - Start a local API with mock cotent based off your shapes
  flags:  -p --project - Tipe project id that this schema belongs to
          -s --schema - Path to your schema file
`
