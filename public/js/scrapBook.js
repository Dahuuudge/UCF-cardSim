   
window.onload = (function(doc){
    
const cardBlank = doc.getElementById("cardTemplate"),
      workArea = doc.getElementById("workArea");
    
let xmlhttp = new XMLHttpRequest(),
    cardColour,
    ucfData,
    ucfModel = {};
    
    function allowDrop(ev) {
      ev.preventDefault();
    }

    function drag(ev) {
      ev.dataTransfer.setData("text", ev.target.id);
    }

    function drop(ev) {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("text");
      ev.target.appendChild(document.getElementById(data));
    }
//    
    function starta(ucfData){
        
        class UCF_enity {
            constructor(ref, data){
                this.referance = ref;
                this.name = data.name;
                this.description = data.description;
                this.colour = data.colour;
                
            }
            pgEle(b){
                let ele;
                
                if(b){
                    ele = cardBlank.cloneNode(true);
                    ele.id = this.referance;
                    ele.querySelector(".title").innerHTML = this.name;
                    ele.querySelector(".text").innerHTML = this.description;
                    workArea.appendChild(ele);
                    //console.log(ele);
                }
            }
    
            init() {
                let makeCard = this.referance.slice(-1)/1;
                this.pgEle(makeCard? true:false);
            
            }
        }
   
        
         function recursiveCall(wireFrame, model) {
                
                let enityName,
                    child;
                
                if (model === undefined) {
                    model = {};
                }
                
                for (child in wireFrame) {
                    if (wireFrame.hasOwnProperty(child)) {
                        model[enityName] = new UCF_enity(child, wireFrame[child]);
                        model[enityName].init();
                                             
                        if (wireFrame[child].children) {
                            //if (!model[enityName].children) model[enityName].children = {};
                            recursiveCall(wireFrame[child].children, model[enityName].children);
                        }
                    }
                }
                return model;
            }
        
        ucfModel = recursiveCall(ucfData);
        
        console.log(ucfModel);
    }
    
    
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        ucfData = JSON.parse(this.responseText);
        starta(ucfData);
      }
    };

    xmlhttp.open("GET", "data/UCF_data3.json", true);
    xmlhttp.send();

}(window.document));
