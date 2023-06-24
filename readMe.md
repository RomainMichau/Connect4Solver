# Generate OAS

```
swagger generate spec  -w server -o ./server/specs/spec.json   
```

# Generate OAS and angular http client

```
swagger generate spec  -w server -o ./server/specs/spec.json   &&  openapi-generator-cli generate -i ./server/specs/spec.json -g typescript-angular -o ./webapp/src/services 
```