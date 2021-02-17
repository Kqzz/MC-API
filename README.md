# MC API
> written by Kqzz and contributors

This is a Minecraft API (similar to [aschon](https://api.ashcon.app/mojang/v2/user/Notch)) that provides information on a minecraft user

## Routes

The MC API is meant to be easy to use, so I'll be documenting the **entire** responses of all the routes here.

### `/api/mojang/user/USERNAME`

This is the main url path and provides information (solely from mojang) on a user. If you would like more information (namemc data and optifine info) then you can pass in the `optifine=true` and/or the `namemc=true` parameters (those are optional, if you don't provide them it will be the same as if you set both to false).

```
{
   "uuid": str,  // The specified user's UUID
   "username": str,  // The specified user's username (may differ from url parameter in capitalization and will always be the exact username the specified user has)
   "legacy": false,  // If the specified user is a legacy account
   "demo": false,  // If the specified user is a demo account
   "username_history":[
      {
         "name":str // The original name of the account
      },
      {
         "name":str,
         "changedToAt":1453040327000
      },
      {
         "name":str,
         "changedToAt":1501704950000
      },
      {
         "name":str,  // Username that the acc was changed to 
         "changedToAt":1592502429000 // Time the username was changed to this.
      }
   ],  // The past usernames this person has had. username_history[-1] will always be the latest. 
   "textures":{
      "skin":{
         "custom":bool,  // if the skin is custom (not alex or steve) // POSSIBLY BUGGY
         "slim":bool,  // if the skin is a slim model or not // also POSSIBLY BUGGY
         "url":str (url)  // Link to their current skin
      },
      "cape":{
         "cape":bool,  // If the user has a cape
         "url":str (url) // Cape url if they happen to have one
      }
   },
   "optifine":{ // ONLY PRESENT IF `optifine=true` is passed as a url query string (https://en.wikipedia.org/wiki/Query_string)
      "has_cape": bool,  // If they have an optifine cape
      "cape_url": str (url)  // Link to the optifine cape // TODO: base64 data of cape
   }, 
   "namemc":{ // ONLY PRESENT IF `namemc=true` is passed as a url query string (https://en.wikipedia.org/wiki/Query_string)
      "username": str,  // username of the account (it's a duplicate of the prev data) // TODO: remove dupe data if it's not a /api/namec url
      "uuid":str,  // uuid of the specified account
      "location":str,  // location of the specified account https://imgur.com/a/D0jgisi
      "views":int,  // Profile views
      "accounts":{
        "discord": str,  // only present if linked
        "facebook": str,  // only present if linked
        "github": str,  // only present if linked
        "instagram": str,  // only present if linked
        "reddit": str,  // only present if linked
        "snapchat": str,  // only present if linked
        "soundcloud": str,  // only present if linked
        "steam": str,  // only present if linked
        "telegram": str,  // only present if linked
        "twitch": str,  // only present if linked
        "twitter": str,  // only present if linked
        "youtube": str  // only present if linked
      }, // Linked accounts (https://imgur.com/a/D0jgisi) NOTE: these accounts require no verification so one could link false accounts
      "skins":{  // NAMEMC previous skins. TODO: make it so you can exclude this since it can be HUGE.
         "skin_ids":[  // NAMEMC IDS of the skins
            "74b89bbd8b071fab"
         ],
         "texture_urls":[
            "https://namemc.com/texture/74b89bbd8b071fab.png"  // NAMEMC links to the skin textures.
         ]
      }
   }
}
```

### `/api/namemc/user/USERNAMEorUUID`

To be honest, this route is fairly useless. I recommend using the Mojang route and passing in the `namemc=true` [url query string](https://en.wikipedia.org/wiki/Query_string).

```
{ // ONLY PRESENT IF `namemc=true` is passed as a url query string (https://en.wikipedia.org/wiki/Query_string)
      "username": str,  // username of the account (it's a duplicate of the prev data) // TODO: remove dupe data if it's not a /api/namec url
      "uuid":str,  // uuid of the specified account
      "location":str,  // location of the specified account https://imgur.com/a/D0jgisi
      "views":int,  // Profile views
      "accounts":{
        "discord": str,  // only present if linked
        "facebook": str,  // only present if linked
        "github": str,  // only present if linked
        "instagram": str,  // only present if linked
        "reddit": str,  // only present if linked
        "snapchat": str,  // only present if linked
        "soundcloud": str,  // only present if linked
        "steam": str,  // only present if linked
        "telegram": str,  // only present if linked
        "twitch": str,  // only present if linked
        "twitter": str,  // only present if linked
        "youtube": str  // only present if linked
      }, // Linked accounts (https://imgur.com/a/D0jgisi) NOTE: these accounts require no verification so one could link false accounts
      "skins":{  // NAMEMC previous skins. TODO: make it so you can exclude this since it can be HUGE.
         "skin_ids":[  // NAMEMC IDS of the skins
            "74b89bbd8b071fab"
         ],
         "texture_urls":[
            "https://namemc.com/texture/74b89bbd8b071fab.png"  // NAMEMC links to the skin textures.
         ]
}
```

### `/api/namemc/droptime/name`

Get's the droptime of a username and returns the Unix timestamp of it.

```
{
   "droptime": int // Unix timestamp in seconds
}
```

### Errors

when there's an error the status code should be representative of the error code and there should be a json response that looks similar to the one below but tbh this api is kinda messy atm with garbage error handling. `TODO: add error handling that works`


```
{
   "error": str // message about your error
}
```

## TODO

- Error handling that works