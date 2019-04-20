'use strict';

const { Contract } = require('fabric-contract-api');
class Patents extends Contract {

    async instantiate(ctx) {

        let owners =[{"type": "owner", "name": "yes", "patentIDs": ["1","5"], "id": "5"},
            {"type": "owner", "name": "owner1", "patentIDs": ["1","3","5"], "id": "6"},
            {"type": "owner", "name": "eric", "patentIDs": ["3","4","6"], "id": "7"},
            {"type": "owner", "name": "abby", "patentIDs": ["2","4","5"], "id": "8"},
            {"type": "owner", "name": "kristen", "patentIDs": ["2","4","7"], "id": "9"}];

        let publishers =[{"type": "publisher", "name": "speedmatters", "patentIDs": ["1","2","3"], "id": "10"},
        {"type": "publisher", "name": "wantitnow", "patentIDs": ["4","5"], "id": "11"},
        {"type": "publisher", "name": "dummypublisher", "patentIDs": ["6","7"], "id": "13"}];

        let verifiers =[  {"type": "verifier", "name": "mazen", "patentIDs": ["1","3","4","6"], "id": "1"},
            {"type": "verifier", "name": "marwan", "patentIDs": ["2"], "id": "2"},
            {"type": "verifier", "name": "mary", "patentIDs": ["5"], "id": "3"},
            {"type": "verifier", "name": "anytime", "patentIDs": ["7"], "id": "4"}];

        let auditors =[  {"type": "auditor", "name": "info", "patentIDs": ["1","2","3","4","5","6","7"], "id": "12"}];

        await ctx.stub.putState('owners', Buffer.from(JSON.stringify(owners)));
        await ctx.stub.putState('publishers', Buffer.from(JSON.stringify(publishers)));
        await ctx.stub.putState('auditors', Buffer.from(JSON.stringify(auditors)));
        await ctx.stub.putState('verifiers', Buffer.from(JSON.stringify(verifiers)));
    }

    async RegisterOwner(ctx, ownerId, ownerName) {

        let owner = {
            id: ownerId,
            name: ownerName,
            type: 'owner',
            patentIDs: []
        };
        await ctx.stub.putState(ownerId, Buffer.from(JSON.stringify(owner)));

        //add ownerId to 'owners' key
        let data = await ctx.stub.getState('owners');
        if (data) {
            let owners = JSON.parse(data.toString());
            owners.push(ownerId);
            await ctx.stub.putState('owners', Buffer.from(JSON.stringify(owners)));
        } else {
            throw new Error('owners not found');
        }

        // return owner object
        return JSON.stringify(owner);
    }
    async RegisterPublisher(ctx, publisherId, publisherName) {

        let publisher = {
            id: publisherId,
            name: publisherName,
            type: 'publisher',
            patentIDs: []
        };
        await ctx.stub.putState(publisherId, Buffer.from(JSON.stringify(publisher)));

        //add ownerId to 'owners' key
        let data = await ctx.stub.getState('publishers');
        if (data) {
            let publishers = JSON.parse(data.toString());
            publishers.push(ownerId);
            await ctx.stub.putState('publishers', Buffer.from(JSON.stringify(publishers)));
        } else {
            throw new Error('publishers not found');
        }

        // return owner object
        return JSON.stringify(publisher);
    }
    async RegisterVerifier(ctx, verifierID, verifierName) {

        let verifier = {
            id: verifierID,
            name: verifierName,
            type: 'verifier',
            patentIDs: []
        };
        await ctx.stub.putState(verifierID, Buffer.from(JSON.stringify(verifier)));

        //add ownerId to 'owners' key
        let data = await ctx.stub.getState('verifiers');
        if (data) {
            let verifiers = JSON.parse(data.toString());
            verifiers.push(ownerId);
            await ctx.stub.putState('verifiers', Buffer.from(JSON.stringify(verifiers)));
        } else {
            throw new Error('verifier not found');
        }

        // return owner object
        return JSON.stringify(verifier);
    }
    async RegisterAuditor(ctx, auditorId, auditorName) { 

        let owner = {
            id: auditorId,
            name: auditorName,
            type: 'auditor',
            patentIDs: []
        };
        await ctx.stub.putState(auditorId, Buffer.from(JSON.stringify(auditor)));

        //add ownerId to 'owners' key
        let data = await ctx.stub.getState('auditors');
        if (data) {
            let auditors = JSON.parse(data.toString());
            auditors.push(auditorId);
            await ctx.stub.putState('auditors', Buffer.from(JSON.stringify(auditors)));
        } else {
            throw new Error('auditors not found');
        }

        // return owner object
        return JSON.stringify(auditor);
    }

        // add an order object to the blockchain state identifited by the orderNumber
        async CreatePatent(ctx, ownerIDs, verifierID, patentID , patentName ,industry , art , status , details) {

            // verify ownerIDs
            ownerIDs.forEach(ownerId => {
                let ownerData = await ctx.stub.getState(ownerId);
                let owner;
                if (ownerData) {
                    owner = JSON.parse(ownerData.toString());
                    if (owner.type !== 'owner') {
                        throw new Error('owner not identified');
                    }
                } else {
                    throw new Error('owner not found');
                }
            });

    
            // verify verifierID
            let verifierData = await ctx.stub.getState(verifierID);
            let verifier;
            if (verifierData) {
                verifier = JSON.parse(verifierData.toString());
                if (verifier.type !== 'verifier') {
                    throw new Error('verifier not identified');
                }
            } else {
                throw new Error('verifier not found');
            }    

            let patent = {
                "type":"patent",
                "name":patentName,
                "id":patentID,
                "ownerIDs":ownerIDs,
                "verifierID":verifierID,
                "status":status,
                "industry":industry,
                "priorArt":art,
                "details":details
           
            };
            //add patent to owners
            ownerIDs.forEach(ownerId => {
                let ownerData = await ctx.stub.getState(ownerId);
                let owner;
                if (ownerData) {
                    owner = JSON.parse(ownerData.toString());
                    owner.patentIDs.push(patentID)
                    await ctx.stub.putState(ownerId, Buffer.from(JSON.stringify(owner)));
                }
            })
            //add patent to verifier
            verifier.patentIDs.push(patentID);
            await ctx.stub.putState(verifierID, Buffer.from(JSON.stringify(verifier)));
        
            //store patent identified by patentID
            await ctx.stub.putState(patentID, Buffer.from(JSON.stringify(patent)));
    
            // return financeCo object
            return JSON.stringify(patent);
        }

        async verifyPatent(ctx, patentID, ownerID, verifierID) {

            // get patent json
            let data = await ctx.stub.getState(patentID);
            let patent;
            if (data) {
                patent = JSON.parse(data.toString());
            } else {
                throw new Error("patent not found");
            }
    
            // verify ownerId
            let ownerData = await ctx.stub.getState(ownerID);
            let owner;
            if (ownerData) {
                owner = JSON.parse(ownerData.toString());
                if (owner.type !== "owner") {
                    throw new Error("owner not identified");
                }
            } else {
                throw new Error("owner not found");
            }
    
            // verify verifierId
            let verifierData = await ctx.stub.getState(verifierID);
            let verifier;
            if (verifierData) {
                verifier = JSON.parse(verifierData.toString());
                if (verifier.type !== "verifier") {
                    throw new Error("verifier not identified");
                }
            } else {
                throw new Error("verifier not found");
            }
    

            if (patent.status == "new") {
                patent.status = "verified";
                await ctx.stub.putState(patentID, Buffer.from(JSON.stringify(patent)));
    
                //add patent to the verifier after being verified
                verifier.patentIDs.push(patentID);
                await ctx.stub.putState(verifierID, Buffer.from(JSON.stringify(verifier)));
    
                return JSON.stringify(patent);
            } else {
                throw new Error('patent not created');
            }
        }


        async rejectPatent(ctx, patentID, ownerID, verifierID) {

            // get patent json
            let data = await ctx.stub.getState(patentID);
            let patent;
            if (data) {
                patent = JSON.parse(data.toString());
            } else {
                throw new Error("patent not found");
            }
    
            // verify ownerId
            let ownerData = await ctx.stub.getState(ownerID);
            let owner;
            if (ownerData) {
                owner = JSON.parse(ownerData.toString());
                if (owner.type !== "owner") {
                    throw new Error("owner not identified");
                }
            } else {
                throw new Error("owner not found");
            }
    
            // verify verifierId
            let verifierData = await ctx.stub.getState(verifierID);
            let verifier;
            if (verifierData) {
                verifier = JSON.parse(verifierData.toString());
                if (verifier.type !== "verifier") {
                    throw new Error("verifier not identified");
                }
            } else {
                throw new Error("verifier not found");
            }
    

            if (patent.status == "new") {
                patent.status = "rejected";
                await ctx.stub.putState(patentID, Buffer.from(JSON.stringify(patent)));
    
                //add patent to the verifier after being rejected
                verifier.patentIDs.push(patentID);
                await ctx.stub.putState(verifierID, Buffer.from(JSON.stringify(verifier)));
    
                return JSON.stringify(patent);
            } else {
                throw new Error('patent not created');
            }
        }

        
        async publishPatent(ctx, patentID, ownerID, publisherID) {

            // get patent json
            let data = await ctx.stub.getState(patentID);
            let patent;
            if (data) {
                patent = JSON.parse(data.toString());
            } else {
                throw new Error("patent not found");
            }
    
            // verify ownerID
            let ownerData = await ctx.stub.getState(ownerID);
            let owner;
            if (ownerData) {
                owner = JSON.parse(ownerData.toString());
                if (owner.type !== "owner") {
                    throw new Error("owner not identified");
                }
            } else {
                throw new Error("owner not found");
            }
    
            // verify publisherID
            let publisherData = await ctx.stub.getState(publisherID);
            let publisher;
            if (publisherData) {
                publisher = JSON.parse(publisherData.toString());
                if (publisher.type !== "publisher") {
                    throw new Error("publisher not identified");
                }
            } else {
                throw new Error("publisher not found");
            }
    

            if (patent.status == "verified") {
                patent.status = "published";
                await ctx.stub.putState(patentID, Buffer.from(JSON.stringify(patent)));
    
                //add patent to the verifier after being rejected
                publisher.patentIDs.push(patentID);
                await ctx.stub.putState(publisherID, Buffer.from(JSON.stringify(publisher)));
    
                return JSON.stringify(patent);
            }
            else if(patent.status == "rejected") {
                throw new Error("Patent has been rejected so it cannot be published.");
            }
            else {
                throw new Error("patent not created");
            }
        }
        
    // get the state from key
    async GetState(ctx, key) {
        let data = await ctx.stub.getState(key);
        let jsonData = JSON.parse(data.toString());
        return JSON.stringify(jsonData);
    }
        
}

module.exports = Patents;