# Upload file
curl -F "file=@/path/to/your.csv" http://localhost:3000/upload
# Search policies by username
curl "http://localhost:3000/policies/search?username=Muskan"
# Aggregate
curl http://localhost:3000/policies/aggregate-by-user
# Schedule a message
curl -X POST -H "Content-Type: application/json" -d '{"message":"hello","day":"2025-11-12","time":"14:30"}' http://localhost:3000/scheduler/schedule
