window.system = (function () {
    "use strict";
    
    var system = {
        
        wireframe: {
            
            root: {
                
                name: "UCF",

                children: {

                    Factor_1: {

                        name: "FactorOne",

                        children: {

                            Comp_1: {
                                name: "F1_CompatancyOne"
                            },
                            Comp_2: {
                                name: "F1_CompatancyTwo",
                                
                                children: {
                                    extraDeep: {
                                        name: "nailedIt"
                                    }
                                }
                            },
                            Comp_3: {
                                name: "F1_CompatancyThree"
                            }
                        }
                    },

                    Factor_2: {

                        name: "FactorTwo",

                        children: {
                            Comp_1: {
                                name: "F2_CompatancyOne"
                            },
                            Comp_2: {
                                name: "F2_CompatancyTwo"
                            }
                        }
                    },
                    Factor_3: {

                        name: "FactorThree",

                        children: {
                            Comp_1: {
                                name: "F3_CompatancyOne"
                            },
                            Comp_2: {
                                name: "F3_CompatancyTwo"
                            },
                            Comp_3: {
                                name: "F3_CompatancyThree"
                            }
                        }
                    }
                }
            }
        },
        
        modle: {},
        
        levelObjTypes: ["Framework", "Factor", "Compatancy"],
        
        utils: {
            
            FrameworkItem: function (id) {
                
                this.id = id;
                
            },
            
            recursiveCall: function (wireFrame, model) {
                
                var enityName,
                    child;
                
                if (model === undefined) {
                    model = {};
                }
                
                for (child in wireFrame) {
                    if (wireFrame.hasOwnProperty(child)) {
                        
                        enityName = wireFrame[child].name;
                        model[enityName] = new system.utils.FrameworkItem(enityName);
                        
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
    
    system.modle = system.utils.recursiveCall(system.wireframe);
    
    return system;
}());