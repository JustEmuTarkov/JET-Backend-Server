const fs = require("fs");
const fileRead = fs.readFileSync;
const fileWrite = (fileName) => { fs.writeFileSync(fileName, null, " "); }
const jsonParse = (fileName) =>  JSON.parse(fileRead(fileName));

var SearchEngineData = {};

SearchEngineData["items"] = [];
SearchEngineData["suits"] = [];
SearchEngineData["quests"] = [];
SearchEngineData["hideout"] = {areas: [], production: [], scavcase: []};

// LOAD LANGUAGE
const languageData = jsonParse("../../db/locales/en/locale.json");
const locationsLang = languageData.locations; // Name, Description
const itemCategoriesLang = languageData.handbook;
const itemsLang = languageData.templates; // Name, ShortName, Description
const interfaceLang = languageData.interface; // Name, ShortName, Description
const questsLang = languageData.quest; // name, location, conditions
const suitsLang = languageData.customization; // Name, ShortName, Description

// Loading Items Data from nodes...
const inputFileNodes = fs.readdirSync("../../db/items");
let baseItems = {};
for (let file in inputFileNodes) {
  let filePath = inputFileNodes[file];
  for (let item of jsonParse("../../db/items/" + filePath))
  {
    baseItems[item._id] = item;
  }
}
// Prepared items Data
const inputFileSuits = fs.readdirSync("../../db/customization");
let baseSuits = {};
for (let file in inputFileSuits) {
  let filePath = inputFileSuits[file];
  baseSuits[filePath.replace(".json","")] = jsonParse("../../db/customization/" + filePath);
}
// Prepared suits Data


// Functions to generate category chains
function DeepGetCategoryChain_Names(CategoryChain = "", toFind = ""){
  if(toFind == "") return "";
  if(CategoryChain == ""){
    CategoryChain = baseItems[toFind]._name;
  }else{
    CategoryChain = CategoryChain + "|" + baseItems[toFind]._name;
  }
  if(baseItems[toFind]._parent != ""){
    CategoryChain = DeepGetCategoryChain_Names(CategoryChain, baseItems[toFind]._parent);
  }
  return CategoryChain;
}
function DeepGetCategoryChain_Ids(CategoryChain = "", toFind = ""){
  if(toFind == "") return "";
  if(CategoryChain == ""){
    CategoryChain = baseItems[toFind]._id;
  }else{
    CategoryChain = CategoryChain + "|" + baseItems[toFind]._id;
  }
  if(baseItems[toFind]._parent != ""){
    CategoryChain = DeepGetCategoryChain_Ids(CategoryChain, baseItems[toFind]._parent);
  }
  return CategoryChain;
}

for(let itemId in baseItems){
  if(baseItems[itemId]._parent == "") continue;
  let construct = {
    Id: "",
    IsItem: false,
    Name: "",
    ShortName: "",
    CategoryId: "",
    CategoryName: "",
    CategoryChainId: "",
    CategoryChainName: ""
  }
  const langItem = itemsLang[itemId];
  construct.Id = itemId;
  construct.IsItem = baseItems[itemId]._type == "Item";
  if(langItem){
    construct.Name = langItem.Name;
    construct.ShortName = langItem.ShortName;
  } else {
    construct.Name = baseItems[itemId]._name;
    construct.ShortName = baseItems[itemId]._name;
  }
  construct.CategoryId = baseItems[itemId]._parent;
  construct.CategoryName = baseItems[baseItems[itemId]._parent]._name;
  construct.CategoryChainId = DeepGetCategoryChain_Names("", baseItems[itemId]._parent),
  construct.CategoryChainName = DeepGetCategoryChain_Ids("", baseItems[itemId]._parent)
  // if more data needed will be added accordingly
  SearchEngineData.items.push(construct);
}

// END OF ITEMS GENERATION

for(let suitId in baseSuits){
  if(baseSuits[suitId]._parent == "") continue;
  
  let construct = {
    Id: baseSuits[suitId]._id,
    Name: baseSuits[suitId]._name,
    IsEquipable: baseSuits[suitId]._type != "Node",
    EquipOn: (baseSuits[suitId]._props.BodyPart) ? baseSuits[suitId]._props.BodyPart : baseSuits[suitId]._props.Name,
    EquipSide: baseSuits[suitId]._props.Side,
    AvaliableByDefault: baseSuits[suitId]._props.AvailableAsDefault ? baseSuits[suitId]._props.AvailableAsDefault : false,
    PrefabPath: ""
  }
  construct.PrefabPath = (baseSuits[suitId]._props.Prefab) ? baseSuits[suitId]._props.Prefab.path : "";
  SearchEngineData.suits.push(construct);
}

// END OF SUITS GENERATION

const inputFileAreas = fs.readdirSync("../../db/hideout/areas");
const inputFileProduction = fs.readdirSync("../../db/hideout/production");
const inputFileScavCase = fs.readdirSync("../../db/hideout/scavcase");

const areaNames = {
  0: "Vents",
  1: "Security",
  2: "Lavatory",
  3: "Stash",
  4: "Generator",
  5: "Heating",
  6: "Water Collector",
  7: "Medstation",
  8: "Nutrition Unit",
  9: "Rest Space",
  10: "Workbench",
  11: "Intelligence Center",
  12: "Shooting Range",
  13: "Library",
  14: "Scav Case",
  15: "Illumination",
  16: "Place of Fame",
  17: "Air Filtration Unit",
  18: "Solar Power",
  19: "Booze Generator",
  20: "Bitcoin Farm",
  21: "Christmas Tree",
}

for(let fileName of inputFileAreas){
  const data = jsonParse("../../db/hideout/areas/" + fileName)
  let construct = {
    Id: data._id,
    Name: areaNames[data._type],
    EnableOnStart: data.enabled,
    NeedFuelToWork: data.needsFuel,
    CraftGiveXP: data.craftGivesExp,
    stages: {}
  }
  construct.stages
  for(let stage in data.stages){
    if(data.stages[stage].requirements.length == 0){
      construct.stages[stage] = "No Requirements";
    } else {
      construct.stages[stage]["requirements"] = [];
      for(let requirement of data.stages[stage].requirements){
        switch(requirement.type){
          case "Item": 
            let requirementStruct = {
              Id = requirement.templateId,
              Name = itemsLang[requirement.templateId].Name,
              Amount = requirement.Count,
              Type = "Item"
            }
            construct.stages[stage]["requirements"].push(requirementStruct);
          break;
          case "Node":
            let requirementStruct = {
              Id = requirement.areaType,
              Name = areaNames[requirement.areaType],
              Amount = requirement.requiredLevel,
              Type = "Node"
            }
            construct.stages[stage]["requirements"].push(requirementStruct);
          break;
        }
      }
      construct.stages[stage]["bonuses"] = [];
      for(let bonus of data.stages[stage].bonuses){
        switch(bonus.type){
          case "TextBonus": 
            let bonusesStruct = {
              Id = bonus.id,
              Name = interfaceLang["hideout_" + bonus.id],
              Passive = bonus.passive,
              Production = bonus.production,
              Visible = bonus.visible,
              Icon = bonus.icon,
              Type = "TextBonus"
            }
            construct.stages[stage]["bonuses"].push(bonusesStruct);
          break;
          case "EnergyRegeneration":
          
          break;
        }
      }
      construct.stages[stage]["slots"] = data.stages[stage].slots;
      construct.stages[stage]["constructionTime"] = data.stages[stage].constructionTime;
      construct.stages[stage]["description"] = data.stages[stage].description;
      
    }
  }
  
  SearchEngineData.hideout.areas.push();
}
