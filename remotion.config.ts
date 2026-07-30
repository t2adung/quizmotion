import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// H.264 MP4 out of the box; good default for YouTube & Shorts.
Config.setCodec("h264");
