[![Dependencies](https://img.shields.io/david/DeaLoux/Aqukin)](https://david-dm.org/DeaLoux/Aqukin)
[![License](https://badgen.net/github/license/DeaLoux/Aqukin)](https://github.com/DeaLoux/Aqukin/blob/master/LICENSE)

# Aqukin

Your diamond ninja combat baka maid, a bot that was created based on a Virtual Youtuber known as **Minato Aqua**

# Commands

## Default Prefix
- `>`
- You can also `mention` Aqukin `@Aqukin` instead of using prefix for commands
- You can change the default prefix using the `configureprefix` command, see below for more details

## Settings Commands (Admin/Owner only)
### configureprefix
- Aliases - `cp` `changeprefix` `prefix`
- Usage - `>configureprefix <new prefix>`
- Example - `>prefix ?!` -- will change the bot's current prefix to `?!`
- Description - Configure the prefix

---

### togglereact
- Aliases - `tr` `react`
- Usage - `>togglereact`
- Description - Toggle enabling/disabling the reaction module, which allow Aqukin to react to messages with your server `custom emojis`

---

### togglemessagereply
- Aliases - `tmr` `reply` `messagereply`
- Usage - `>togglemessagereply`
- Description - Toggle enabling/disabling the message reply module, which allow Aqukin to reply to specific messages

---

## Music Commands 
### play
- Aliases - `p`
- Usage - `>play <Youtube URL> or <Keywords>`
- Example - `>p https://www.youtube.com/watch?v=-aB6MQU8l1s`
- Description - Enqueue Youtube Video/Playlist/Track from given URL or search results

---

### pause
- Aliases - `wait` `stop`
- Usage - `>pause`
- Description - Pause the audio player

---

### resume
- Aliases - `continue`
- Usage - `>resume`
- Description - Resume the audio player

---

### skip
- Aliases - `s` `n` `nxt` `next`
- Usage - `>skip`
- Description - Skip the current track

---

### move
- Aliases - `m` `to` `time`
- Usage - `>move <hh:mm:ss>`
- Example - `>m 02:32` `(2:32 or 0:2:32 or 1:92 or 152) also yield the same results` -- will move the current track to the position of **2 minutes and 32 seconds**
- Description - Move the audio player to a specified timestamp in the current track `usable by the track requester/admin`

---

### setvolume
- Aliases - `v` `sv` `volume`
- Usage - `>setvolume [percentage]`
- Example - `>v 150` -- will set the volume to `150%` of the default volume
- Description - Set the audio player's volume by percentage `maximum 400`

---

### viewqueue
- Aliases - `q` `vq` `queue`
- Usage - `>viewqueue`
- Description - View the audio player's queue

---

### shufflequeue
- Aliases - `sq` `shuffle`
- Usage - `>shufflequeue`
- Description - Shuffle the audio player's queue

---

### clearqueue
- Aliases - `cq` `clrq` `clear`
- Usage - `>clearqueue`
- Description - Clear the audio player's queue

---

### removeduplicate
- Aliases - `rd` `duplicate`
- Usage - `>removeduplicate`
- Description - Remove duplicated tracks from the audio player's queue

---

### loopqueue
- Aliases - `lq`
- Usage - `>loopqueue`
- Description - Toggle looping/unlooping the current queue

---

### looptrack
- Aliases - `lt` `ls` `loopsong`
- Usage - `>looptrack`
- Description - Toggle looping/unlooping the current track

---

### disconnect
- Aliases - `dc` `leave`
- Usage - `>disconnect`
- Description - Disconnect the audio player from the voice channel

---

## Utilities Commands
### help
- Aliases - `h`
- Usage - `>help [command name/alias]`
- Example - `>help m` -- will show info about the **move** command
- Description - Provide info about commands

---

### cleantext
- Aliases - `ct` `del` `clean` `delete`
- Usage - `>cleantext [number]`
- Example - `>ct 12` -- will bulk delete 13 messages **including 1 for the command call**
- Description - Bulk delete a specified number of messages and the command call, default to 10 if leave blank `maximum 99`

---

### userinfo
- Aliases - `ui` `user` `info` 
- Usage - `>userinfo [mentioned user]`
- Example - `>ui @Aqukin` -- will show info about **Aqukin**
- Description - Provide info about the mentioned user/Aqukin/yourself

---

### liveinfo
- Aliases - `li` `live` `streaming`
- Usage - `>liveinfo <channel name/URL>`
- Example - `>li Aqua ch.` -- will search youtube for the 1st channel matches the argument and display their live status
- Description - Check the live status of a youtube channel

---

### dogeza
- Aliases - `d`
- Usage - `>dogeza`
- Description - Display randomly one of **Minato Aqua** dogeza pictures

---

### baquafina
- Aliases - `pure` `aquafina` `bakafina` `aqukinfina`
- Usage - `>baquafina`
- Description - Display randomly one of the Baquafina(?) pictures

---

### bakaqua
- Aliases - `baka` `tensai` `bakaqua`
- Usage - `>bakaqua`
- Description - Display randomly one of the Baqua(?) pictures

---

## [License](https://github.com/DeaLoux/Aqukin/blob/master/LICENSE)
- Copyright (c) 2020 Minh Duc Le / DeaLoux
- Aqukin is licensed under the [MIT License](https://github.com/DeaLoux/Aqukin/blob/master/LICENSE)
- The code is open-source and free to use, please have a look at the license and keep in mind about giving appropriate credit where it is due, thank you.
