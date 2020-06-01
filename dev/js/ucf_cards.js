window.onload =  (function (doc) {
    "use strict";
    
    const cardTemplates = doc.getElementById("cardTemplates"),
          pageArea = doc.getElementsByTagName("body")[0],
          workArea = doc.getElementById("workArea"),
          sortResultTable = doc.getElementById("sortResults"),
          deckPlace = doc.getElementById("deckStart");
    
    let xmlhttp = new XMLHttpRequest(),
        ucfData,
        system = {
        
            wireframe: {},

            model: {},
            
            FrameworkItem: class {
                
                    constructor(data){
                        this.name = data.name;
                        this.title = data.title;
                        this.description = data.description;
                        this.colour = data.colour;
                    }
                
                    buildPgEle() {
                        
                        const su = system.utils,
                              namePath = su.namePath(this.name),
                              typeNo = namePath.length,
                              createNode = su.createNode,
                              wfData = su.getNamedObj(this.name, system.wireframe),
                              card = namePath[typeNo - 1];
                        
                        let  lastLevel = false;
                        
                        class cardFieldData {
                            constructor(cObj){
                                this.title = cObj.title;
                                this.description = cObj.description;
                                this.cardNoOf = cObj.noOfSibs;
                                this.cardIndex = card.split("-").pop();
                            }
                        }

                        function makeCard (cardType, id, obj) {
                            
                            let ele = cardTemplates.querySelector(cardType).cloneNode(true);
                            
                            ele.id = id;
  
                            for (let [key, value] of Object.entries(obj)){
                                try{
                                    ele.querySelector("."+ key).innerHTML = value;
                                } catch(err) {
                                    console.log(err.message);
                                }
                                
                            }
                        
                            // I could move this into the switch stament? (case 4 else)
                            // if the sort card has two values (eg. 'Relatively Simple', 'Easy' ) turn on the congunction ('or'): 'Relatively Simple or Easy'
                            if (cardType === "#sortCard" && obj.val_2 !== "" ){
                                ele.querySelector(".conjunc").style.display = "block";
                            } else if (cardType === "#sortCard" && obj.val_2 === "" ) {
                                ele.querySelector(".val_2").style.display = "none";
                            }
                            return ele;
                        }
                
                        function chooseSortButton(idFrag){
                            
                            let ele = cardTemplates.querySelector("#sortForm").cloneNode(true);
                            ele.querySelector("h4").innerHTML = idFrag;
                            ele.querySelector("button").addEventListener("click", su.chooseSort);
                            ele.id += idFrag;
                            return ele;
                        }
                    
                        if(typeNo > 1) {

                            this.parent = su.getNamedObj(su.getParentName(this.name));
                            this.noOfSibs = Object.keys(system.utils.getNamedObj(this.parent.name, system.wireframe).children).length;
                        }
                
                        pageArea.addEventListener("dragend", () => {pageArea.style.cursor = "default";});
                        
                        
                        switch(typeNo) {
                            case 1:
                                //  1st level
                                // UCF : Group = Card Deck – Element = Box / Top Card
                                this.pgEle = createNode("artical", "UCF_deck", "");
                                break;
                                
                            case 2:
                                //  2nd level
                                // COMPATANCY CARDS : Group = Compatancy Cards – Element = NA
                                // SORT CARDS :  Group = Sort Cards – Element = NA    
                                this.pgEle = createNode("div", this.name , "");
                                system.model.UCF.pgEle.appendChild(this.pgEle);
                                break;
                                
                            case 3:
                                //  3rd level
                                // COMPATANCY CARDS : Group = Factor Type – Element = Factor Card
                                // else
                                // SORT CARDS :  Group = Sort Type – Element = NA
                                if(card.indexOf("Factor") === 0){
                                    
                                    this.cardFieldData = new cardFieldData(this);
                                    this.cardFieldData.cardRef = this.cardFieldData.cardIndex;
                                    this.pgEle = createNode("div", card , "FactorGroup");
                                    this.pgEle.appendChild(makeCard("#factorCard", this.name, this.cardFieldData));
                                    this.pgEle.querySelector(".factorColfill").style.backgroundColor = this.colour;
                                   
                                }else{
                                    this.pgEle = createNode("div", card, "sortType");     
                                    this.pgEle.appendChild(chooseSortButton(card));
                                    system.model.UCF.children.UCF_SortCards.pgEle.appendChild(this.pgEle);
                                }
                                break;
                                
                            case 4:
                                // 4th Level
                                // COMPATANCY CARDS : Group = NA – Element = Dimention Card
                                // else
                                // SORT CARDS :  Group = NA – Element = Sort Card
                                
                                 if(card.indexOf("Dimension") === 0){
                                     this.cardFieldData = new cardFieldData(this);
                                     this.cardFieldData.cardRef = this.parent.cardFieldData.cardRef + "." + this.cardFieldData.cardIndex;
                                     this.pgEle = makeCard("#dimentionCard", this.name, this.cardFieldData);
                                     this.pgEle.querySelector(".factorColfill").style.backgroundColor = this.parent.colour;
                                     
                                     this.pgEle.addEventListener("dragstart", system.utils.dragstart_handler);
                                     
                                 } else {
                                     
                                     class sortCardFieldData extends cardFieldData{
                                         constructor(cObj){
                                            super(cObj);
                                                this.sortType = cObj.parent.title;
                                                this.text_1 = ((t2 = "") => { 
                                                                const t1 = su.getNamedObj(su.getParentName(cObj.name), system.wireframe).text_1;
                                                                return t1+t2; 
                                                                })(wfData.textMod);
                                                this.val_1 = wfData.val_1;
                                                this.val_2 = ((v2 = "") => v2)(wfData.val_2);
                                         }
                                     }
                                     this.sortCardFieldData = new sortCardFieldData(this);
                                     delete this.sortCardFieldData.title;
                                     delete this.sortCardFieldData.description;
                                     this.sortCardFieldData.cardRef = this.sortCardFieldData.cardIndex;
                                     this.pgEle = makeCard("#sortCard", this.name, this.sortCardFieldData);
                                     this.pgEle.querySelector(".reciver").setAttribute("data-appendto", this.name);
                                     this.pgEle.addEventListener("drop", system.utils.drop_handler);
                                     this.pgEle.addEventListener("dragover", system.utils.dragover_handler);
                                 }
                                break;
                                
                            case 5:
                                // 5th Level
                                // COMPATANCY CARDS : Group = NA – Element = Components - Add to dimention card
                                // else
                                // SORT CARDS : NA
                            
                                lastLevel = true;
                                
                                break;
                                    
                            default:
                                throw("beyond expected range");
                                
                                break;
                        }
                    
                        if(typeNo > 1 && !lastLevel) { 
                            this.parent.pgEle.appendChild(this.pgEle);
                        }
                    }
                },
                  
            utils: {
                  
                createNode: function createNode (ele, i, c) {
                            let node = document.createElement(ele);      
                            node.id = i;
                            node.className = c;
                            return node;
                        },
                            
                namePath: n => n.split("_"),

                getParentName: n => {
                    let pn = system.utils.namePath(n);
                    pn.pop();
                    return pn.join("_");
                },
                
                getNamedObj: function getNamedObj(n, t = system.model ){
                
                    let nArr = system.utils.namePath(n),
                        srt = "",
                        dad = t,
                        objBarst;
                    
                    nArr.forEach( srtFrag => {
                        srt += srtFrag;
                        objBarst = dad[srt];
                        dad = objBarst.children;
                        srt += "_";  
                    });
                    
                return objBarst;
                },
                  
                dragstart_handler: function(ev){
                    ev.dataTransfer.setData("text", ev.target.id);
                    pageArea.style.cursor = "no-drop";
                },
                        
                drop_handler: function(ev){

                    const sortTable = doc.getElementById("sortResults"),
                          data = ev.dataTransfer.getData("text"),
                          card = system.utils.getNamedObj(data),
                          hook = ev.target,
                          sortName = system.utils.getNamedObj(hook.getAttribute("data-appendto"), system.wireframe).val_1,
                          sortLev = sortTable.querySelector("#" + sortName.replace(" ", "_")),
                          li = system.utils.createNode("li");

                    li.innerHTML = "<span class='compTitle'>" + card.title + "</span>&nbsp;<span class='compRef'>" + card.cardFieldData.cardRef + "</span>";

                    sortLev.appendChild(li);
                    hook.appendChild(card.pgEle);
                    ev.preventDefault();
                },

                dragover_handler: function(ev){

                    pageArea.style.cursor = "pointer";

                    ev.preventDefault();
                    ev.dataTransfer.dropEffect = "move";

                },
                    
                chooseSort: function(){

                    let keepOn = this.parentElement.parentElement,
                        sortTypes = doc.getElementById("UCF_SortCards").querySelectorAll(".sortType"),
                        wfSortName = "UCF_SortCards_" + keepOn.id,
                        sortLevels = system.wireframe.UCF.children.UCF_SortCards.children[wfSortName].children;

                    function addToTable(e,t){
                        let ele = system.utils.createNode(e);
                        ele.innerHTML = t;
                        sortResultTable.appendChild(ele);
                    }


                    sortTypes.forEach( e => { if (e !== keepOn) e.style.display="none"});

                    doc.getElementById("UCF_CompCards").style.top = "-250px";

                    addToTable("h4", "Sort:");
                    addToTable("h5", keepOn.id.replace("Sort", " Sort"));


                    for (let [key, value] of Object.entries(sortLevels)) {

                    addToTable("h4", value.val_1);

                    sortResultTable.appendChild(system.utils.createNode("ul", value.val_1.replace(" ", "_")));

                    }
                },

                recursiveCall: function (wireFrame, model) {

                    var enityName,
                        parent,
                        child;

                    if (model === undefined) {
                        model = system.model;
                    }

                    for (child in wireFrame) {
                        if (wireFrame.hasOwnProperty(child)) {

                            enityName = wireFrame[child].name;
                            model[enityName] = new system.FrameworkItem(wireFrame[child]);
                            model[enityName].buildPgEle();
                            
                            
                            if (wireFrame[child].children) {
                                model[enityName].children = {};
                                system.utils.recursiveCall(wireFrame[child].children, model[enityName].children);
                            }
                        }
                    }
                    deckPlace.appendChild(system.model.UCF.pgEle);
                }
            }
        };
    
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          system.wireframe = JSON.parse(this.responseText);
          system.utils.recursiveCall(system.wireframe);
      }
    };

    xmlhttp.open("GET", "data/UCF_data4.json", true);
    xmlhttp.send();
    
    //workArea.appendChild(system.model.UCF_0.pgEle);
    doc.system = system;
    
    
}(window.document));