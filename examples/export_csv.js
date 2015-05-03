conn = new Mongo();
db = conn.getDB('muse');
print("full_name,size,forks,watchers,created_at,updated_at");
db.repo.find().forEach(function(r){
  print(r.full_name + "," + r.size + "," + r.forks + "," + r.watchers + "," + r.created_at + "," +  r.updated_at);
});
