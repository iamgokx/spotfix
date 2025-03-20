import { useVideoPlayer, VideoView } from "expo-video";
import { StyleSheet, View } from "react-native";

const videoSource = require("../assets/videos/loadingScreen.mp4"); 
export default function CustomSplashScreen() {
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false; // Video plays once
    player.play();
  });

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen={false} // No fullscreen button
        allowsPictureInPicture={false} // No PIP mode
        disableFocus // Prevents controls from appearing on tap
        resizeMode="cover" // Makes video cover entire screen
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  video: {
    width: "100%",
    height: "100%",
    position: "absolute", 
    
  },
});
