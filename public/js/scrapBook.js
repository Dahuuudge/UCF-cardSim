   
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



init() {
                        let hyai = this.name.split("."),
                            typeNo = hyai.length,
                            parent = (less) => { less.pop(); 
                                                less.join('.');
                                               return less},
                            componentList = [],
                            dimention_components;
                        
                        function traversModleTo(n){
                            const strHead = system.modle["UCF_0"];
                            
                        }
                        
                        switch(typeNo) {
                            case 1:
                                console.log("make the Deck");
                                break;
                            case 2:
                                console.log("   conpatancy Cards " + this.name);
                                break;
                            case 3:
                                console.log("       stop appending " + this.name);
                                break;
                            case 4:
                                // please make this more elegnt
                               system.modle.UCF_0.children[hyai[0]+"."+hyai[1]].children[hyai[0]+"."+hyai[1]+"."+hyai[2]].children[hyai[0]+"."+hyai[1]+"."+hyai[2]+"."+hyai[3]].components = [];
                                //console.log("apepend the following components to: " + srt.name);
                                //this.componentPoint = [];
                                break;
                            case 5:
                                let indicator = {
                                    title: this.title,
                                    code: this.code,
                                    description: this.description,
                                    indicators: this.indicators
                                };
                                //console.log("               Component " + this.name + " patent being " + temp);
                                system.modle.UCF_0.children[hyai[0]+"."+hyai[1]].children[hyai[0]+"."+hyai[1]+"."+hyai[2]].children[hyai[0]+"."+hyai[1]+"."+hyai[2]+"."+hyai[3]].components.push(indicator);
                                break;
                            default:
                                console.log("           !!off teh fricken Chart?!");
                                break;
                        }
                        
                        let makeCard = this.name.slice(-1)/1;
                        this.pgEle(makeCard? true:false);

                    }



                            //model[enityName].init();
                            
//                            if(model[enityName].parent) console.log(model[enityName].name + " parent is " + model[enityName].parent.name);
//                            parent = model[enityName];
