import pkg from 'sanzy-spotifydl'; 
const { downloadTrack, downloadAlbum, search } = pkg; 
import fetch from 'node-fetch';
import pkg2 from 'fluid-spotify.js';
const { Spotify } = pkg2;

const handler = async (m, { conn, text }) => {
  if (!text) throw 'Please provide a Spotify URL or search query.'; 
  const isSpotifyUrl = text.match(/^(https:\/\/open\.spotify\.com\/(album|track|playlist)\/[a-zA-Z0-9]+)/i);
  if (!isSpotifyUrl && !text) throw 'Invalid Spotify URL or search query.';
  try {
    if (isSpotifyUrl) {
      if (isSpotifyUrl[2] === 'album') {
        const album = await downloadAlbum(isSpotifyUrl[0]);
        let spotifyInfo = `Album Details :\n\n`;
        spotifyInfo += `  Title : ${album.metadata.title}\n`;
        spotifyInfo += `  Artists : ${album.metadata.artists}\n`;
        await conn.sendMessage(m.chat, {text: spotifyInfo.trim(), contextInfo: {forwardingScore: 9999999}}, {quoted: m});
        for (let i = 0; i < album.trackList.length; i++) {
          await conn.sendMessage(m.chat, {audio: album.trackList[i].audioBuffer, fileName: `${album.trackList[i].metadata.name}.mp3`, mimetype: 'audio/mpeg'}, {quoted: m});
        }
      } else if (isSpotifyUrl[2] === 'track') {
        const track = await downloadTrack(isSpotifyUrl[0]);
        const dlspoty = track.audioBuffer;
        let spotifyInfo = `Track Details :\n\n`;
        spotifyInfo += `  Title : ${track.title}\n`;
        spotifyInfo += `  Artists : ${track.artists}\n`;
        await conn.sendMessage(m.chat, {text: spotifyInfo.trim(), contextInfo: {forwardingScore: 9999999}}, {quoted: m});
        await conn.sendMessage(m.chat, {audio: dlspoty, fileName: `${track.title}.mp3`, mimetype: 'audio/mpeg'}, {quoted: m});
      } else if (isSpotifyUrl[2] === 'playlist') {
        const infos = new Spotify({
          clientID: "7fb26a02133d463da465671222b9f19b",
          clientSecret: "d4e6f8668f414bb6a668cc5c94079ca1",
        });      
        const playlistId = isSpotifyUrl[0].split('/').pop();
        const playlistInfoByID = await infos.getPlaylist(playlistId);
        const tracks = playlistInfoByID.tracks.items;
        let spotifyInfo = `Playlist Details :\n\n`;
        spotifyInfo += `  Title : ${playlistInfoByID.name}\n`;
        spotifyInfo += `  Number of Tracks : ${tracks.length}\n\n`;
        await conn.sendMessage(m.chat, {text: spotifyInfo.trim(), contextInfo: {forwardingScore: 9999999}}, {quoted: m});
        let target = m.chat;
        if (m.isGroup && tracks.length > 20) {
          target = m.sender;
        }
        for (let i = 0; i < tracks.length; i++) {
          const track = await downloadTrack(tracks[i].track.external_urls.spotify);
          await conn.sendMessage(target, { audio: track.audioBuffer, fileName: `${tracks[i].track.name}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m });
        }
      }
    } else {
      const searchTrack = await downloadTrack(text);
      const dlspoty = searchTrack.audioBuffer;
      let spotifyInfo = `Search Results :\n\n`;
      spotifyInfo += `  Title : ${searchTrack.title}\n`;
      spotifyInfo += `  Artists : ${searchTrack.artists}\n`;
      await conn.sendMessage(m.chat, {text: spotifyInfo.trim(), contextInfo: {forwardingScore: 9999999}}, {quoted: m});
      await conn.sendMessage(m.chat, {audio: dlspoty, fileName: `${searchTrack.title}.mp3`, mimetype: 'audio/mpeg'}, {quoted: m});
    }  
  } catch (error) {
    console.error(error);
    throw 'An error occurred while processing the request.';
  }
};
handler.command = /^(spotifydl|spotify)$/i;
handler.limit = 4
handler.register = true
export default handler;
