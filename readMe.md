Connect4 game with a minimax 'AI'    
Backend: Go  
Frontend: Angular  
Game mode:
- Human VS Human
- Human VS AI
- AI VS AI


# Online version
https://connect4-go.romainmic.com/

# Generate OAS

```
swagger generate spec  -w server -o ./server/specs/spec.json   
```

# Generate OAS and angular http client

```
swagger generate spec  -w server -o ./server/specs/spec.json   &&  openapi-generator-cli generate -i ./server/specs/spec.json -g typescript-angular -o ./webapp/src/services 
```

# Run with docker
```
 docker build -t connect4 . && docker run -p 8081:8081 connect4:latest
```
http://localhost:8081
