'use strict';

module.exports = function(validation, Worker) {
    return {
        setRouting : function(router) {
            
			/* Retrieving, adding and removing workers */
			router.post('/workers', validation.validateWorker, this.addWorker);
			router.get('/workers', this.getWorkers);
			router.delete('/workers', this.deleteWorkers);
			
			/* Retrieving, updating and deleting a specific worker */
			router.get('/workers/:id', this.getWorkerById);
			router.put('/workers/:id', this.updateWorkerById);
			router.delete('/workers/:id', this.deleteWorkerById);
			
			/* Updating a specific worker's address and contact_number */
			router.put('/update_address_and_contact/:id', this.updateAddressAndContact);
			router.put('/update_password/:id', this.updatePassword);
        
		},
		
		addWorker: function(req, res) {
			
			let new_worker = new Worker();
			
			new_worker.first_name = req.body.first_name;
			new_worker.last_name = req.body.last_name;
			new_worker.email = req.body.email;
			new_worker.password = req.body.password;
			new_worker.country = req.body.country;
			new_worker.address = req.body.address;
			new_worker.contact_number = req.body.contact_number;
			
			new_worker.save( (savedWorker) => {
				return res.status(200).json({error: false, message: 'New Worker Created Successfully'});
			});
			
		},
		
		getWorkers: function(req, res) {
			
			Worker.find({}).then(function(workers) {
				if(workers.length == 0) {
					return res.status(400).json({error: true, message: "There is no worker registered on the website"});
				}
				res.status(200).json({error: false, workers: workers});
			});
			
		},
		
		deleteWorkers: function(req, res) {
			
			Worker.deleteMany({}).then(function(response) {
				console.log(response);
				if(response) {
					return res.status(200).json({error: false, deletedRecords: response.deletedCount});
				}
				res.status(400).json({error: true, message: "There is no worker to be deleted"});
			});
		},
		
		getWorkerById: function(req, res) {
		
			if(!req.params.id) {
				return res.status(400).json({error: true, message: "Please provide worker's id"});
			}
			
			Worker.findOne({_id: req.params.id}).then(function(worker) {
				res.status(200).json({error: false, worker: worker});
			}).catch(function(err) {
				res.status(400).json({error: true, message: "Worker with this Id is not found"});
			});
			
		},
		
		updateWorkerById: function(req, res) {
		
			if(!req.params.id) {
				return res.status(400).json({error: true, message: "Please provide worker's id"});
			}
			
			Worker.findByIdAndUpdate(req.params.id, req.body, {new: true}).then(function(updatedWorker){
				if(updatedWorker) {
					res.status(200).json({error: false, message: updatedWorker});
				}
				return res.status(400).json({error: true, message: "Worker with this id is not found"});
			}).catch(function(err){
				res.status(400).send({error: true, message: "No worker is found against the given id"});
			});
			
		},
		
		deleteWorkerById: function(req, res) {
			
			if(!req.params.id) {
				return res.status(400).json({error: true, message: "Please provide worker's id"});
			}
			
			Worker.findByIdAndRemove(req.params.id).then(function(response){
				if(response._id == req.params.id) {
					return res.status(200).send({error: false, message: "Worker removed successfully"});
				}
				res.status(400).send({error: true, message: "No worker is found against the given id"});
			}).catch(function(err){
				res.status(400).send({error: true, message: "No worker is found against the given id"});
			});
			
		},
		
		updateAddressAndContact: function(req, res) {
		
			if(!req.params.id || !req.body.address || !req.body.contact_number) {
				return res.status(400).json({error: true, message: "Please provide worker's id, contact_number and address"});
			}
			
			Worker.findByIdAndUpdate(req.params.id, {address: req.body.address, contact_number: req.body.contact_number}, {new: true}).then(function(updatedWorker){
				if(updatedWorker) {
					res.status(200).json({error: false, message: updatedWorker});
				}
				return res.status(400).json({error: true, message: "Worker with this id is not found"});
			}).catch(function(err){
				res.status(400).send({error: true, message: "No worker is found against the given id"});
			});
			
		},
		
		updatePassword: function(req, res) {
		
			if(!req.params.id || !req.body.old_password || !req.body.new_password) {
				return res.status(400).json({error: true, message: "Please provide worker's id, old and new password"});
			}
			
			Worker.findOne({_id: req.params.id, password: req.body.old_password}).then(function(user) {
				if(!user) {
					return res.status(400).json({error: false, message: "No worker exist against these credentials"});
				}
				
				Worker.findByIdAndUpdate(req.params.id, {password: req.body.new_password}, {new: true}).then(function(updatedWorker){
					if(updatedWorker) {
						res.status(200).json({error: false, message: updatedWorker});
					}
					return res.status(400).json({error: true, message: "Worker with this id is not found"});
				})
			});
			
		}
	}
}