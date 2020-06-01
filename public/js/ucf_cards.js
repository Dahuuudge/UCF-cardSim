window.onload =  (function (doc) {
    "use strict";
    
    const cardBlank = doc.getElementById("cardTemplate"),
          workArea = doc.getElementById("workArea");
    
    let xmlhttp = new XMLHttpRequest(),
        ucfData,
        system = {
        
            wireframe: {

            },

            modle: {},

            levelObjTypes: ["Framework", "Factor", "Compatancy"],

            utils: { 

                FrameworkItem: class {
                    constructor(data){
                        this.name = data.name;
                        this.description = data.description;
                        this.referance = data.referance;
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
                        }
                    }
                    init() {
                        let makeCard = this.referance.slice(-1)/1;
                        this.pgEle(makeCard? true:false);

                    }
                },
                
                dragingEvents: (function(){
                    doc.allowDrop = function allowDrop(ev) {
                      ev.preventDefault();
                    }

                    doc.drag = function drag(ev) {
                        //console.log(this);
                      ev.dataTransfer.setData("text", ev.target.id);
                    }

                    doc.drop = function drop(ev) {
                        //console.log(ev);
                      ev.preventDefault();
                      var data = ev.dataTransfer.getData("text");
                      ev.target.appendChild(document.getElementById(data));
                    }
                }()),

                recursiveCall: function (wireFrame, model) {

                    var enityName,
                        child;

                    if (model === undefined) {
                        model = {};
                    }

                    for (child in wireFrame) {
                        if (wireFrame.hasOwnProperty(child)) {

                            enityName = wireFrame[child].name;
                            model[enityName] = new system.utils.FrameworkItem(wireFrame[child]);
                            model[enityName].init();

                            if (wireFrame[child].children) {
                                model[enityName].children = {};
                                system.utils.recursiveCall(wireFrame[child].children, model[enityName].children);
                            }
                        }
                    }

                    return model;
                }
            }
        };
    
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          system.wireframe = JSON.parse(this.responseText);
          system.modle = system.utils.recursiveCall(system.wireframe);
          
      }
    };

    xmlhttp.open("GET", "data/UCF_data3.json", true);
    xmlhttp.send();
    
    doc.system = system;
    
}(window.document));