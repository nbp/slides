#!/usr/bin/env nix-shell
#!nix-shell -i python -p python3 -p python3Packages.aiohttp

import aiohttp
from aiohttp import web, WSCloseCode
import asyncio


async def index_handler(request):
    return web.FileResponse('./index.html')

async def svg_handler(request):
    return web.FileResponse('./jit-principles.svg')

websockets = []
async def websocket_handler(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    websockets.append(ws)
    print("websocket connected")

    async for msg in ws:
        if msg.type == aiohttp.WSMsgType.TEXT:
            print("Dispatch %s" % msg.data)
            if msg.data == 'close':
                await ws.close()
            else:
                for _ws in websockets:
                    await _ws.send_str(msg.data)
        elif msg.type == aiohttp.WSMsgType.ERROR:
            print('ws connection closed with exception %s' % ws.exception())

    print("websocket disconnected")
    websockets.remove(ws)
    return ws


def create_runner():
    app = web.Application()
    app.add_routes([
        web.get('/',   index_handler),
        web.get('/jit-principles.svg',   svg_handler),
        web.get('/ws', websocket_handler),
    ])
    return web.run_app(app)

create_runner()
