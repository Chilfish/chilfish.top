---
title: Python 代码片段们
date: 2023-12-30
---

### Serve the Vite SPA

```py
import mimetypes

from flask import Flask, request, send_file, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder="./web", static_url_path="")

# 允许跨域
CORS(app, resources=r"/*")

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_spa(path):
    if not path or path.endswith(".html"):
        return send_from_directory(app.static_folder, "index.html")
    else:
        return send_from_directory(app.static_folder, path)

@app.route("/assets/<path:path>")
def serve_assets(path):
    mine_type = mimetypes.guess_type(path)[0]
    if path.endswith(".js"):
        mine_type = "application/javascript"

    return send_from_directory(f"{app.static_folder}/assets", path, mimetype=mine_type)
```
