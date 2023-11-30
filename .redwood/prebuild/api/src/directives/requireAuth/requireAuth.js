import { createValidatorDirective } from '@redwoodjs/graphql-server';
import { requireAuth as applicationRequireAuth } from "../../lib/auth";
export const schema = {
  "kind": "Document",
  "definitions": [{
    "kind": "DirectiveDefinition",
    "description": {
      "kind": "StringValue",
      "value": "Use to check whether or not a user is authenticated and is associated\nwith an optional set of roles.",
      "block": true
    },
    "name": {
      "kind": "Name",
      "value": "requireAuth"
    },
    "arguments": [{
      "kind": "InputValueDefinition",
      "name": {
        "kind": "Name",
        "value": "roles"
      },
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "String"
          }
        }
      },
      "directives": []
    }],
    "repeatable": false,
    "locations": [{
      "kind": "Name",
      "value": "FIELD_DEFINITION"
    }]
  }],
  "loc": {
    "start": 0,
    "end": 180,
    "source": {
      "body": "\n  \"\"\"\n  Use to check whether or not a user is authenticated and is associated\n  with an optional set of roles.\n  \"\"\"\n  directive @requireAuth(roles: [String]) on FIELD_DEFINITION\n",
      "name": "GraphQL request",
      "locationOffset": {
        "line": 1,
        "column": 1
      }
    }
  }
};
const validate = ({
  directiveArgs
}) => {
  const {
    roles
  } = directiveArgs;
  applicationRequireAuth({
    roles
  });
};
const requireAuth = createValidatorDirective(schema, validate);
export default requireAuth;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjcmVhdGVWYWxpZGF0b3JEaXJlY3RpdmUiLCJyZXF1aXJlQXV0aCIsImFwcGxpY2F0aW9uUmVxdWlyZUF1dGgiLCJzY2hlbWEiLCJ2YWxpZGF0ZSIsImRpcmVjdGl2ZUFyZ3MiLCJyb2xlcyJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2FwaS9zcmMvZGlyZWN0aXZlcy9yZXF1aXJlQXV0aC9yZXF1aXJlQXV0aC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ3FsIGZyb20gJ2dyYXBocWwtdGFnJ1xuXG5pbXBvcnQgdHlwZSB7IFZhbGlkYXRvckRpcmVjdGl2ZUZ1bmMgfSBmcm9tICdAcmVkd29vZGpzL2dyYXBocWwtc2VydmVyJ1xuaW1wb3J0IHsgY3JlYXRlVmFsaWRhdG9yRGlyZWN0aXZlIH0gZnJvbSAnQHJlZHdvb2Rqcy9ncmFwaHFsLXNlcnZlcidcblxuaW1wb3J0IHsgcmVxdWlyZUF1dGggYXMgYXBwbGljYXRpb25SZXF1aXJlQXV0aCB9IGZyb20gJ3NyYy9saWIvYXV0aCdcblxuZXhwb3J0IGNvbnN0IHNjaGVtYSA9IGdxbGBcbiAgXCJcIlwiXG4gIFVzZSB0byBjaGVjayB3aGV0aGVyIG9yIG5vdCBhIHVzZXIgaXMgYXV0aGVudGljYXRlZCBhbmQgaXMgYXNzb2NpYXRlZFxuICB3aXRoIGFuIG9wdGlvbmFsIHNldCBvZiByb2xlcy5cbiAgXCJcIlwiXG4gIGRpcmVjdGl2ZSBAcmVxdWlyZUF1dGgocm9sZXM6IFtTdHJpbmddKSBvbiBGSUVMRF9ERUZJTklUSU9OXG5gXG5cbnR5cGUgUmVxdWlyZUF1dGhWYWxpZGF0ZSA9IFZhbGlkYXRvckRpcmVjdGl2ZUZ1bmM8eyByb2xlcz86IHN0cmluZ1tdIH0+XG5cbmNvbnN0IHZhbGlkYXRlOiBSZXF1aXJlQXV0aFZhbGlkYXRlID0gKHsgZGlyZWN0aXZlQXJncyB9KSA9PiB7XG4gIGNvbnN0IHsgcm9sZXMgfSA9IGRpcmVjdGl2ZUFyZ3NcbiAgYXBwbGljYXRpb25SZXF1aXJlQXV0aCh7IHJvbGVzIH0pXG59XG5cbmNvbnN0IHJlcXVpcmVBdXRoID0gY3JlYXRlVmFsaWRhdG9yRGlyZWN0aXZlKHNjaGVtYSwgdmFsaWRhdGUpXG5cbmV4cG9ydCBkZWZhdWx0IHJlcXVpcmVBdXRoXG4iXSwibWFwcGluZ3MiOiJBQUdBLFNBQVNBLHdCQUF3QixRQUFRLDJCQUEyQjtBQUVwRSxTQUFTQyxXQUFXLElBQUlDLHNCQUFzQjtBQUU5QyxPQUFPLE1BQU1DLE1BQU07RUFBQTtFQUFBO0lBQUE7SUFBQTtNQUFBO01BQUE7TUFBQTtJQUFBO0lBQUE7TUFBQTtNQUFBO0lBQUE7SUFBQTtNQUFBO01BQUE7UUFBQTtRQUFBO01BQUE7TUFBQTtRQUFBO1FBQUE7VUFBQTtVQUFBO1lBQUE7WUFBQTtVQUFBO1FBQUE7TUFBQTtNQUFBO0lBQUE7SUFBQTtJQUFBO01BQUE7TUFBQTtJQUFBO0VBQUE7RUFBQTtJQUFBO0lBQUE7SUFBQTtNQUFBO01BQUE7TUFBQTtRQUFBO1FBQUE7TUFBQTtJQUFBO0VBQUE7QUFBQSxDQU1sQjtBQUlELE1BQU1DLFFBQTZCLEdBQUdBLENBQUM7RUFBRUM7QUFBYyxDQUFDLEtBQUs7RUFDM0QsTUFBTTtJQUFFQztFQUFNLENBQUMsR0FBR0QsYUFBYTtFQUMvQkgsc0JBQXNCLENBQUM7SUFBRUk7RUFBTSxDQUFDLENBQUM7QUFDbkMsQ0FBQztBQUVELE1BQU1MLFdBQVcsR0FBR0Qsd0JBQXdCLENBQUNHLE1BQU0sRUFBRUMsUUFBUSxDQUFDO0FBRTlELGVBQWVILFdBQVcifQ==