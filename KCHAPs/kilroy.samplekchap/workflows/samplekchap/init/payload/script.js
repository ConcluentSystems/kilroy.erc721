/**
 * app/kilroy.sampledapp/sampledapp/init.js - preflight/postflight functions for kilroy.sampledapp/sampledapp/init
 * @module kilroy.sampledapp/sampledapp/init
 * @file kilroy.sampledapp/sampledapp/init preflight/postflight implementation
 * @author system
 * @copyright Copyright ©2022, Concluent Systems, LLC. All rights reserved.
 */
"use strict";
const MODULE_NAME = "workflow:kilroy.sampledapp/sampledapp/init";
const debug = require('debug')(MODULE_NAME);
debug.log = console.info.bind(console); //https://github.com/visionmedia/debug#readme
const Promise = require("bluebird"); // jshint ignore:line

const Web3 = require ('web3');
let web3 = null;

const setupWeb3 = (networkAddr) => {
    const ftmAddr = networkAddr || process.env.FTM_RPC_ADDR;
    web3 = new Web3(new Web3.providers.HttpProvider(ftmAddr));
    return web3
};

const isConnected = () => {
    if (!web3) return false;
    return web3.eth.getNodeInfo().then (ok => {
        return Promise.resolve (!!ok);
    });
}

const getBalance = (address) => {
    return web3.eth.getBalance(address).then (bal=>{
        return Promise.resolve (bal);
    });
}

//-----------------------------------------------------

function preflight(authData, wfProxy) {
	//called before the workflow steps run
    debug ("preflight");
    //assume success
    wfProxy.setGlobalValue("step_success", true);
    debug ("Running...");
    return Promise.resolve({success: true});
}

//-----------------------------------------------------

function begin (authData, wfProxy, step, theForm) {
	//called to load/preconfigure/define a form by ID passed in step.args.formID
    debug ("begin formID:" + step.args.formID);
    return new Promise( function(resolve, reject){
        try {
			var formObj = theForm; //any form from the workflow def is passed here
			var formData = wfProxy.getGlobalValue ("formData"); // key/value object overriding field defaults
            var formErrors = wfProxy.getGlobalValue('formErrors'); // errors from a previous form submission

			// do work here to pre-populate fields, or to generate dynamic forms, etc.
			
            return resolve({
                success: true,
                args: {
                    form: formObj,
                    formValues: formData,
                    formErrors: formErrors
                }
            });
        } catch(err){
            debug ("begin err: " + err);
            return reject(err);
        }
    });
}

//-----------------------------------------------------

function end (authData, wfProxy, step, formData) {
	// called to postprocess form data, persist it, etc. before returning results to workflow
    var result = {
            success: true,
            path: wfProxy.PATH_SUCCESS,
            args: formData
        };
    debug ("end: " + step.args.formID);
    
    //do whatever field validation, database saves, etc. required, then return result
    
    return Promise.resolve(result);
}

//-----------------------------------------------------

function postflight(authData, wfProxy) {
    debug ("postflight");
    
    return Promise.resolve({success: true});
}


//-----------------------------------------------------

function terminate (authData, wfProxy) {
	//perform any cleanup or rollback required if a workflow is terminated without completing
	try {
		debug ("terminate");
		return Promise.resolve ({success: true});
	}
	catch (err) {
		debug ("terminate exception : " + JSON.stringify (err));
		return Promise.resolve ({success: false});
	}
}

module.exports = {
    preflight: preflight,
    postflight: postflight,
    begin: begin,
    end: end,
    terminate: terminate
};

