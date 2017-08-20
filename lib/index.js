#!/usr/bin/env node
const co = require('co');
const fs = require('fs');
const path = require('path');

const initialize = require("./initialize")
const genericHandler = require("./genericHandler")

const installPreact = require("./install/installPreact")
const installAliasify = require("./install/installAliasify")
const installBabelPluginResolver = require("./install/installBabelPluginResolver")

const getUsesYarn = require("./get/getUsesYarn")

const checkForPackageJSON = require("./check/checkForPackageJSON")
const checkWebpack = require("./check/checkWebpack")
const checkBabel = require("./check/checkBabel")
const checkBrowserify = require("./check/checkBrowserify")

const modWebpackConfig = require("./mod/modWebpackConfig")
const modBabelRC = require("./mod/modBabelRC")
const modBrowserifyConfig = require("./mod/modBrowserifyConfig")


let start = ()=>{

  let state = {}

  initialize()
  .then(getUsesYarn)
  .then((usesYarn)=>{
    state.usesYarn = usesYarn
    return state
  })
  .then(checkForPackageJSON)
  .then(()=>{
    return installPreact(state)
  })
  .then(checkWebpack)
  .then((usesWebpack)=>{
    if(usesWebpack) return modWebpackConfig()
    return
  })
  .then(checkBabel)
  .then((usesBabel)=>{
    if(usesBabel) return installBabelPluginResolver(state).then(modBabelRC)
    return
  })
  .then(checkBrowserify)
  .then((usesBrowserify)=>{
    if(usesBrowserify) return installAliasify(state).then(modBrowserifyConfig)
    return
  }).then((state)=>{

    console.log("\nDONE!")
    console.log("- Build and run the project as you normally would.")
    console.log("- If you encounter a bug, running `bye-react-undo` will undo all the changes made by this tool.")
    process.exit()
    return
  }).catch(genericHandler)
}

start()