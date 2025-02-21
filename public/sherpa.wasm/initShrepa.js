const loadSherpaModule = async () => {
    try {
      // if (typeof Module === 'undefined') {
      //   throw new Error('Module is not defined');
      // }
      window.sherpaModule = Module;
      Module.onRuntimeInitialized = function() {
        console.log('inited!');

        let config = {
          modelConfig: {
            debug: 1,
            tokens: './tokens.txt',
          },
        };

        if (fileExists('sense-voice.onnx') == 1) {
          config.modelConfig.senseVoice = {
            model: './sense-voice.onnx',
            useInverseTextNormalization: 1,
          };
        } else if (fileExists('whisper-encoder.onnx')) {
          config.modelConfig.whisper = {
            encoder: './whisper-encoder.onnx',
            decoder: './whisper-decoder.onnx',
          };
        } else if (fileExists('transducer-encoder.onnx')) {
          config.modelConfig.transducer = {
            encoder: './transducer-encoder.onnx',
            decoder: './transducer-decoder.onnx',
            joiner: './transducer-joiner.onnx',
          };
          config.modelConfig.modelType = 'transducer';
        } else if (fileExists('nemo-transducer-encoder.onnx')) {
          config.modelConfig.transducer = {
            encoder: './nemo-transducer-encoder.onnx',
            decoder: './nemo-transducer-decoder.onnx',
            joiner: './nemo-transducer-joiner.onnx',
          };
          config.modelConfig.modelType = 'nemo_transducer';
        } else if (fileExists('paraformer.onnx')) {
          config.modelConfig.paraformer = {
            model: './paraformer.onnx',
          };
        } else if (fileExists('telespeech.onnx')) {
          config.modelConfig.telespeechCtc = './telespeech.onnx';
        } else if (fileExists('moonshine-preprocessor.onnx')) {
          config.modelConfig.moonshine = {
            preprocessor: './moonshine-preprocessor.onnx',
            encoder: './moonshine-encoder.onnx',
            uncachedDecoder: './moonshine-uncached-decoder.onnx',
            cachedDecoder: './moonshine-cached-decoder.onnx'
          };
        } else {
          console.log('Please specify a model.');
          alert('Please specify a model.');
        }
      
        recognizer = new OfflineRecognizer(config, Module);

        // recognizer = createOnlineRecognizer(Module);
        window.sherpaRecognizer =recognizer;
        console.log('recognizer is created!', recognizer);

        vad = createVad(Module);
        window.vad = vad;
        console.log('vad is created!', vad);
    
        buffer = new CircularBuffer(30 * 16000, Module);
        window.wasmBuffer = buffer; 
        console.log('CircularBuffer is created!', buffer);
      };


    } catch (error) {
      console.error('Failed to load WASM module', error);
    }
  };

  function fileExists(filename) {
    const filenameLen = Module.lengthBytesUTF8(filename) + 1;
    const buffer = Module._malloc(filenameLen);
    Module.stringToUTF8(filename, buffer, filenameLen);
  
    let exists = Module._SherpaOnnxFileExists(buffer);
  
    Module._free(buffer);
  
    return exists;
  }
  
  loadSherpaModule();