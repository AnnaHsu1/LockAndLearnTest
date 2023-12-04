const express = require('express');
const router = express.Router();
const WorkPackage = require('../schema/workPackageSchema.js');
const User = require('../schema/userSchema.js');

const WorkPackage2 = require('../schema/workPackage.js');

// Create a new work package
router.post('/createWorkPackage', async (req, res) => {
  const { name, grade, description, price, packageCount, instructorID } = req.body;
  try {
    const newWorkPackage = new WorkPackage2({
      name,
      grade,
      description,
      price,
      packageCount,
      instructorID,
    });
    const savedWorkPackage = await newWorkPackage.save();
    res.status(201).json(savedWorkPackage);
  } catch (error) {
    console.error('Error creating work package:', error);
    res.status(500).json({ error: 'An error occurred while creating the work package.' });
  }
});

// Fetch all work packages for that instructor
router.get('/getWorkPackages/:instructorId', async (req, res) => {
  try {
    const instructorID = req.params.instructorId;
    const allWorkPackages = await WorkPackage2.find({ instructorID: instructorID });
    res.status(200).json(allWorkPackages);
  } catch (error) {
    console.error('Error fetching all work packages:', error);
    res.status(500).json({ error: 'An error occurred while fetching all work packages.' });
  }
});

// Fetch and delete a specific work package by ID
router.delete('/deleteWorkPackage/:workpackageID', async (req, res) => {
  try {
    const workPackageId = req.params.workpackageID;
    const deletedWorkPackage = await WorkPackage2.findByIdAndDelete(workPackageId);
    if (!deletedWorkPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }
    res.status(200).json(deletedWorkPackage);
  } catch (error) {
    console.error('Error deleting work package:', error);
    res.status(500).json({ error: 'An error occurred while deleting the work package.' });
  }
});

router.put('/updateWorkPackage/:workpackageID', async (req, res) => {
  try {
    const workPackageId = req.params.workpackageID;
    const { name, grade, description, price } = req.body;
    const existingWorkPackage = await WorkPackage2.findById(workPackageId);
    if (!existingWorkPackage) {
      throw new Error('Work package not found with the specified _id');
    } else {
      existingWorkPackage.name = name;
      existingWorkPackage.grade = grade;
      existingWorkPackage.description = description;
      existingWorkPackage.price = price;
    }
    const editedWorkpackage = await existingWorkPackage.save();
    res.status(200).json(editedWorkpackage);
  } catch (error) {
    console.error('Error editing work package:', error);
    res.status(500).json({ error: 'An error occurred while editing the work package.' });
  }
});

// Create a new work package
router.post('/create', async (req, res) => {
  try {
    // Get the data for the new work package from the request body
    // use the commented out code below if want to add subcategories/tags to the work package
    // const { name, workPackageId, materials, quizzes, tags, grade, subcategory, instructorID } =
    //   req.body;
    const { name, workPackageId, grade, instructorID, description, price } = req.body;
    // Create a new work package document using the WorkPackage model
    // use the commented out code below if want to add subcategories/tags to the work package
    // const newWorkPackage = new WorkPackage({
    //   name,
    //   workPackageId,
    //   materials,
    //   quizzes,
    //   tags,
    //   grade,
    //   subcategory,
    //   instructorID,
    // });
    const newWorkPackage = new WorkPackage({
      name,
      workPackageId,
      grade,
      instructorID,
      description,
      price,
    });

    // Save the new work package to the database
    const savedWorkPackage = await newWorkPackage.save();

    // Send a success response with the created work package
    res.status(201).json(savedWorkPackage);
    console.log('Created');
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error creating work package:', error);
    res.status(500).json({ error: 'An error occurred while creating the work package.' });
  }
});

// Fetch all work packages
router.get('/allWorkPackages', async (req, res) => {
  try {
    // Retrieve all work packages from the database
    const allWorkPackages = await WorkPackage.find();
    // Send a success response with the array of work packages
    res.status(200).json(allWorkPackages);
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error fetching all work packages:', error);
    res.status(500).json({ error: 'An error occurred while fetching all work packages.' });
  }
});

// Fetch all work packages
router.get('/fetchWorkpackages/:id', async (req, res) => {
  const instructorID = req.params.id;
  try {
    // Retrieve all work packages from the database
    const allWorkPackages = await WorkPackage.find({ instructorID: instructorID });
    // Send a success response with the array of work packages
    res.status(200).json(allWorkPackages);
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error fetching all work packages:', error);
    res.status(500).json({ error: 'An error occurred while fetching all work packages.' });
  }
});

// Fetch work packages of a specific parent user (owned or unowned)
router.get('/fetchWorkpackagesParent/:id', async (req, res) => {
  const parentId = req.params.id;
  console.log('query type:' + req.query.displayOwned);
  const displayOwned = req.query.displayOwned === 'true';

  try {
    // Retrieve the parent user by ID
    const parentUser = await User.findById(parentId);
    //console.log('Parent ID received: ' + parentId);

    if (!parentUser) {
      //console.log('Parent user not found');
      return res.status(404).json({ error: 'Parent user not found' });
    }

    console.log('Parent found' + parentUser);

    // Handle empty or undefined purchasedWorkPackages
    const purchasedWorkPackages = parentUser.purchasedWorkPackages || [];

    let workPackagesQuery = {};
    if (displayOwned) {
      // Fetch owned work packages if query param indicates to display owned
      workPackagesQuery = { _id: { $in: purchasedWorkPackages } };
    } else {
      // Fetch unowned work packages if query param indicates to display unowned
      workPackagesQuery = { _id: { $nin: purchasedWorkPackages } };
    }

    // Retrieve work packages based on the constructed query
    const filteredWorkPackages = await WorkPackage.find(workPackagesQuery);
    
    const anonymousInstructor = {
      firstName: 'Anonymous',
      lastName: '',
    };

    const deletedInstructor = {
      firstName: 'Deleted',
      lastName: 'User',
    };

    const processedWorkPackages = await Promise.all(
      filteredWorkPackages.map(async (workPackage) => {
        try {
          // Check if instructorID exists in the WorkPackage object (legacy data)
          if (!workPackage.instructorID) {
            const updatedWorkPackage = { ...workPackage.toObject(), instructorDetails: anonymousInstructor };
    
            return updatedWorkPackage;
          }
    
          // If th field exists, fetch the firstName and lastName based on instructorID
          const instructorDetails = await User.findById(workPackage.instructorID, 'firstName lastName');
    
          //If user doesn't exist in the database, set instructorDetails to Deleted Account
          if (!instructorDetails) {
            const updatedWorkPackage = { ...workPackage.toObject(), instructorDetails: deletedInstructor };
    
            return updatedWorkPackage;
          }
    
          // Construct a new object with the queried data
          const instructorData = {
            firstName: instructorDetails.firstName,
            lastName: instructorDetails.lastName,
          };
    
          // Merge the instructor details into the workPackage object
          const updatedWorkPackage = { ...workPackage.toObject(), instructorDetails: instructorData };
    
          return updatedWorkPackage;
        } catch (error) {
          console.error('Error while processing work package:', error);
          throw error;
        }
      })
    );
    

    // Send a success response with the array of unowned work packages
    res.status(200).json(processedWorkPackages);
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error fetching unowned work packages:', error);
    res.status(500).json({ error: 'An error occurred while fetching unowned work packages.' });
  }
});

// Fetch all packages in the cart of a specific parent user
router.get('/fetchWorkpackagesCart/:id', async (req, res) => {
    const parentId = req.params.id;
    try {
        // Retrieve the parent user by ID
        const parentUser = await User.findById(parentId);
        //console.log('Parent ID received: ' + parentId);

        if (!parentUser) {
            //console.log('Parent user not found');
            return res.status(404).json({ error: 'Parent user not found' });
        }

        console.log('Parent found' + parentUser);

        // Handle empty or undefined cartWorkPackages
        const cartWorkPackages = parentUser.CartWorkPackages || [];

        const anonymousInstructor = {
            firstName: 'Anonymous',
            lastName: '',
        };

        const deletedInstructor = {
            firstName: 'Deleted',
            lastName: 'User',
        };

        // Retrieve all work packages that are in the cart of the parent user
        const WorkPackagesInCart = await WorkPackage.find({
            _id: { $in: cartWorkPackages },
        });

        const processedWorkPackages = await Promise.all(
            WorkPackagesInCart.map(async (workPackage) => {
                try {
                    // Check if instructorID exists in the WorkPackage object (legacy data)
                    if (!workPackage.instructorID) {
                        const updatedWorkPackage = { ...workPackage.toObject(), instructorDetails: anonymousInstructor };

                        return updatedWorkPackage;
                    }
                    // If th field exists, fetch the firstName and lastName based on instructorID
                    const instructorDetails = await User.findById(workPackage.instructorID, 'firstName lastName');
                    //If user doesn't exist in the database, set instructorDetails to Deleted Account
                    if (!instructorDetails) {
                        const updatedWorkPackage = { ...workPackage.toObject(), instructorDetails: deletedInstructor };

                        return updatedWorkPackage;
                    }

                    // Construct a new object with the queried data
                    const instructorData = {
                        firstName: instructorDetails.firstName,
                        lastName: instructorDetails.lastName,
                    };

                    // Merge the instructor details into the workPackage object
                    const updatedWorkPackage = { ...workPackage.toObject(), instructorDetails: instructorData };

                    return updatedWorkPackage;
                   
                } catch (error) {
                    console.error('Error while processing work package:', error);
                    throw error;
                }
            })
        );


        // Send a success response with the array of unowned work packages
        res.status(200).json(processedWorkPackages);
    } catch (error) {
        // Handle errors and send an error response
        console.error('Error fetching unowned work packages:', error);
        res.status(500).json({ error: 'An error occurred while fetching unowned work packages.' });
    }
});



// Add to user cart a specific work package 
router.put('/addToCart/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const workPackageId = req.body.CartWorkPackages;
        

        console.log(workPackageId);
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
     
        // Check if the work package is already in the user's cart
        const isAlreadyInCart = user.CartWorkPackages.includes(workPackageId);
        if (isAlreadyInCart) {
            return res.status(400).json({ error: 'This work package is already in the cart' });
        }
    
        const updatedWorkPackage = await WorkPackage.findByIdAndUpdate(
            workPackageId,
            { $push: { CartWorkPackages: workPackageId } }, // Add the workPackageId to CartWorkPackages array
            { new: true } // Return the updated work package
        );

        if (!updatedWorkPackage) {
            return res.status(404).json({ error: 'Work package not found' });
        }
      
        // Add the work package ID to the user's CartWorkPackage array
        user.CartWorkPackages.push(workPackageId);

        // Save the updated user
        await user.save();

        // Send a success response
        res.status(200).json({ message: 'Work package added to cart successfully' });
    } catch (error) {
        console.error('Error adding work package to user:', error);
        res.status(500).json({ error: 'An error occurred while adding work package to the user.' });
    }
});

// Delete a work package from the cart of a specific user by ID
router.delete('/deleteFromCart/:userId/:selectedWorkPackage', async (req, res) => {
    try {
        
        const workPackageId = req.params.selectedWorkPackage;
        const userId = req.params.userId;
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log("part1");
        // Find the file by its Id and delete it in the materials array
        const updatedWorkPackage = await User.findByIdAndUpdate(
            userId,
            { $pull: { CartWorkPackages: workPackageId } },
            { new: true }
        );
        console.log("part2");
        if (!updatedWorkPackage) {
            return res.status(404).json({ error: 'Work package not found' });
        }

        // Send a success response with the updated work package data
        res.status(200).json({ message: 'Work package removed from cart successfully' });
    } catch (error) {
        console.error('Error deleting work package from cart:', error);
        res.status(500).json({ error: 'An error occurred while deleting the work package from the cart.' });
    }
});

// Fetch all work packages
router.get('/fetchWorkpackages', async (req, res) => {
    try {
        // Retrieve all work packages from the database without filtering by instructorID
        const allWorkPackages = await WorkPackage.find();
        // Send a success response with the array of work packages
        res.status(200).json(allWorkPackages);
    } catch (error) {
        // Handle errors and send an error response
        console.error('Error fetching all work packages:', error);
        res.status(500).json({ error: 'An error occurred while fetching all work packages.' });
    }
});

// Delete a specific work package by ID
router.delete('/delete/:workPackageId', async (req, res) => {
  try {
    const workPackageId = req.params.workPackageId;
    // Use Mongoose's findByIdAndRemove to delete the work package by its ID
    const deletedWorkPackage = await WorkPackage.findByIdAndRemove(workPackageId);
    if (!deletedWorkPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }
    res.status(200).json(deletedWorkPackage);
  } catch (error) {
    console.error('Error deleting work package:', error);
    res.status(500).json({ error: 'An error occurred while deleting the work package.' });
  }
});

// Add a quiz to a work package
router.post('/addquiz/:workPackageId', async (req, res) => {
  try {
    const workPackageId = req.params.workPackageId;
    const quizId = req.body.quizId;

    // Use Mongoose to find and update the work package by its ID
    const updatedWorkPackage = await WorkPackage.findByIdAndUpdate(
      workPackageId,
      { $push: { quizzes: quizId } }, // Add the quizId to the "quizzes" array
      { new: true } // Return the updated work package
    );

    if (!updatedWorkPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }

    res.status(200).json(updatedWorkPackage);
  } catch (error) {
    console.error('Error adding quiz to work package:', error);
    res.status(500).json({ error: 'An error occurred while adding the quiz to the work package.' });
  }
});

router.post('/editWorkPackage/:workPackageId', async (req, res) => {
  try {
    const workPackageId = req.params.workPackageId;
    const { description, price } = req.body;
    const editedWorkPackage = await WorkPackage.findByIdAndUpdate(workPackageId, {
      description: description,
      price: price,
    });
    if (!editedWorkPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }
    res.status(200).json(editedWorkPackage);
  } catch (error) {
    console.error('Error editing work package:', error);
    res.status(500).json({ error: 'An error occurred while editing the work package.' });
  }
});

// Add quizzes to a specific work package by ID
router.post('/addQuizzes/:workPackageId', async (req, res) => {
  try {
    const workPackageId = req.params.workPackageId;
    const quizzes = req.body.quizzes;

    // Use Mongoose's findByIdAndUpdate to update the work package by its ID
    const updatedWorkPackage = await WorkPackage.findByIdAndUpdate(
      workPackageId,
      { $push: { quizzes: { $each: quizzes } } }, // Add the quizzes to the "quizzes" array
      { new: true } // Return the updated work package
    );

    if (!updatedWorkPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }

    // Send a success response with the updated work package data
    res.status(200).json(updatedWorkPackage);
  } catch (error) {
    console.error('Error adding quizzes to work package:', error);
    res.status(500).json({ error: 'An error occurred while adding quizzes to the work package.' });
  }
});

// Fetch a specific work package by ID
router.get('/:workPackageId', async (req, res) => {
  try {
    const workPackageId = req.params.workPackageId;

    // Use Mongoose's findById to find the work package by its ID
    const workPackage = await WorkPackage.findById(workPackageId);

    if (!workPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }

    // Send a success response with the work package data
    res.status(200).json(workPackage);
  } catch (error) {
    console.error('Error fetching work package by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the work package by ID.' });
  }
});

// Add materials to a specific work package by ID
router.put('/addMaterials/:workPackageId', async (req, res) => {
  try {
    const workPackageId = req.params.workPackageId;
    const materials = req.body.materials;

    // Use Mongoose's findById to find the work package by its ID
    const workPackage = await WorkPackage.findById(workPackageId);
    if (!workPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }

    // Remove files that are not selected by user (materials from req)
    const removedMaterials = workPackage.materials.filter(
      (material) => !materials.includes(material)
    );
    if (removedMaterials.length > 0) {
      await WorkPackage.findByIdAndUpdate(
        workPackageId,
        { $pull: { materials: { $in: removedMaterials } } },
        { new: true }
      );
    }

    // Add files that do not already exists in the work package
    const newMaterials = materials.filter((material) => !workPackage.materials.includes(material));
    if (newMaterials.length === 0) {
      return res.status(200).json(workPackage);
    }
    // Use Mongoose's findByIdAndUpdate to update the work package by its ID
    const updatedWorkPackage = await WorkPackage.findByIdAndUpdate(
      workPackageId,
      { $push: { materials: { $each: newMaterials } } },
      { new: true }
    );

    if (!updatedWorkPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }

    // Send a success response with the updated work package data
    res.status(200).json(updatedWorkPackage);
  } catch (error) {
    console.error('Error adding materials to work package:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while adding materials to the work package.' });
  }
});

// Delete material given fileID from a specific work package given by ID
router.delete('/deleteMaterial/:workPackageId/:fileId', async (req, res) => {
  try {
    const workPackageId = req.params.workPackageId;
    const fileId = req.params.fileId;

    // Find the file by its Id and delete it in the materials array
    const updatedWorkPackage = await WorkPackage.findByIdAndUpdate(
      workPackageId,
      { $pull: { materials: fileId } },
      { new: true }
    );

    if (!updatedWorkPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }
    res.status(200).json(updatedWorkPackage);
  } catch (error) {
    console.error('Error deleting material from work package:', error);
    res.status(500).json({ error: 'Error occurred while deleting material from work package' });
  }
});

// Delete a quiz from a specific work package by ID
router.delete('/deleteQuiz/:workPackageId/:quizId', async (req, res) => {
  try {
    const workPackageId = req.params.workPackageId;
    const quizId = req.params.quizId;

    // Use Mongoose's findByIdAndUpdate to update the work package by its ID
    const updatedWorkPackage = await WorkPackage.findByIdAndUpdate(
      workPackageId,
      { $pull: { quizzes: quizId } },
      { new: true }
    );

    if (!updatedWorkPackage) {
      return res.status(404).json({ error: 'Work package not found' });
    }

    // Send a success response with the updated work package data
    res.status(200).json(updatedWorkPackage);
  } catch (error) {
    console.error('Error deleting quiz from work package:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the quiz from the work package.' });
  }
});

module.exports = router;
