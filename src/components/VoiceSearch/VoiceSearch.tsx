import React, { Component } from "react";
import style from "./style.module.scss";

interface VoiceSearchProps {}

interface VoiceSearchState {
  recording: boolean;
}

class VoiceSearch extends Component<VoiceSearchProps, VoiceSearchState> {
  speechRecognitionIsSupported: boolean;
  speechRecognition: SpeechRecognition | null;

  constructor(props: VoiceSearchProps) {
    super(props);

    this.state = {
      recording: false,
    };

    this.speechRecognitionIsSupported = true;
    this.speechRecognition = null;

    this.initSpeechRecognition();
  }

  initSpeechRecognition = () => {
    try {
      this.speechRecognition = new webkitSpeechRecognition();

      this.speechRecognition.addEventListener("result", event => {
        window.open(
          "http://google.ru/search?q=" + event.results[0][0].transcript,
          "",
        );
      });

      this.speechRecognition.addEventListener("start", () => {
        this.setState({
          recording: true,
        });
      });

      this.speechRecognition.addEventListener("end", () => {
        this.setState({
          recording: false,
        });
      });

      this.speechRecognition.addEventListener(
        "error",
        (event: SpeechRecognitionError) => {
          if (event.error !== "no-speech") {
            console.warn("%cERROR: " + event.error, "color: #FF0000;");
            console.warn(event);
          }
        },
      );
    } catch (err) {
      console.warn("SpeechRecognition is not supported by browser.");

      this.speechRecognitionIsSupported = false;
    }
  };

  toggleVoiceListening = () => {
    if (this.speechRecognitionIsSupported && this.speechRecognition) {
      try {
        if (this.state.recording === false) {
          this.speechRecognition.start();
        } else {
          this.speechRecognition.stop();
        }
      } catch (err) {
        console.warn(err.message);
      }
    }
  };

  render() {
    let recording = this.state.recording ? style.recording : "";

    return (
      <button
        className={style.microphone + " " + recording}
        onClick={this.toggleVoiceListening}
      >
        <div className={style.image} />
      </button>
    );
  }
}

export default VoiceSearch;
