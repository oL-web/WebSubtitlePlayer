document.addEventListener("DOMContentLoaded", function () {
    
    const urlObj = window.URL || window.webkitURL;
    const videoNode = document.querySelector('video');
    const cinemaNode = document.querySelector('.cinema-mode');
    const inputFileVideo = document.querySelector("#input-file-video");
    const inputFileSubtitles = document.querySelector("#input-file-subtitles");
    
    const inputFileFocus = function(e){ e.target.classList.add( 'has-focus' ); };
    const inputFileBlur = function(e){ e.target.classList.remove( 'has-focus' ); };
    
    videoNode.addEventListener("play",function(){
        cinemaNode.style.height = "100%";
    });
    
    cinemaNode.addEventListener("click",function(){
        cinemaNode.style.height = 0;
    });
    
    inputFileSubtitles.addEventListener( 'focus', inputFileFocus);
    inputFileSubtitles.addEventListener( 'blur', inputFileBlur);
    inputFileVideo.addEventListener( 'focus', inputFileFocus);
    inputFileVideo.addEventListener( 'blur', inputFileBlur);
     
    function prepareSubtitles(subtitles, fileName){
        const subtitlesArr = subtitles.split("\n");      
        const curlyBrackets = /\{([\w]+?)\}/g;
        const squareBrackets = /\[([\w]+?)\]/g;
        let brackets = null;
        
        var textTrack = videoNode.addTextTrack("subtitles", fileName);
        textTrack.mode = "showing";
        textTrack.default = true;
        
        curlyBrackets.test(subtitlesArr[0]) ? brackets = curlyBrackets :  brackets = squareBrackets;
        
        subtitlesArr.forEach( item => {
            if(item){
                let cue;
                const times = item.match(brackets);
                let subtitle = item.replace(brackets,"");
                subtitle = subtitle.replace("|","\n");
                
                if(subtitle.indexOf("/") != -1){
                     subtitle = subtitle.replace(/\//g,"");
                    subtitle = "<i>" + subtitle + "</i>";
                }
                     
                if(window.VTTCue){
                   cue = new VTTCue(times[0].replace(/\D/g,"") / 10, times[1].replace(/\D/g,"") / 10, subtitle);
                   }
                else{
                    cue = new TextTrackCue(times[0].replace(/\D/g,"") / 10, times[1].replace(/\D/g,"") / 10, subtitle);
                }          
                textTrack.addCue(cue);
            }    
        });
    }
    
    inputFileSubtitles.addEventListener('change', (e) => {  
          const file = e.target.files[0];

          if (file) { 
              const freader = new FileReader();
              
              freader.onload = function (e) {
                  const fileName = inputFileSubtitles.value.split( '\\' ).pop();
                  document.querySelector("#input-file-subtitles+label").textContent = fileName;
                  prepareSubtitles(e.target.result, fileName);
                  
                  if(!videoNode.paused){
                      cinemaNode.style.height = "100%";
                  }           
              }
              freader.readAsText(file);
          } else {
              alert("Nie udało się załadować napisów!");
          } 
    });   
    
     inputFileVideo.addEventListener('change', (e) => {
        const file = e.target.files[0];

         if (file) {
             if(videoNode.canPlayType(file.type)){
                document.querySelector("#input-file-video+label").textContent = inputFileVideo.value.split( '\\' ).pop();
                videoNode.src = urlObj.createObjectURL(file);
                }
             else{
                 alert("Podany przez Ciebie plik nie może zostać odtworzony przez przeglądarkę!");
             }            
          } else {
              alert("Nie udało się załadować wideo!");
          }
    }); 
});