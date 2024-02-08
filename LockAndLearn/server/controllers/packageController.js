const express = require('express');
const router = express.Router();
const Package = require('../schema/packageSchema.js');
const Workpackage = require('../schema/workPackage.js');
const { default: mongoose } = require('mongoose');
const { GridFSBucket } = require('mongodb');
const Quiz = require('../schema/quizSchema.js');

// Create a new package
router.post('/create', async (req, res) => {
  try {
    // Get the data for the new work package from the request body
    const { workPackageID, subcategory, instructorID, description } = req.body;

    const newPackage = new Package({
      workPackageID,
      subcategory,
      instructorID,
      description,
    });

    const updatedWorkpackage = await Workpackage.findById(workPackageID);
    updatedWorkpackage.packageCount = updatedWorkpackage.packageCount + 1;

    await updatedWorkpackage.save();

    // Save the new work package to the database
    const savedPackage = await newPackage.save();

    // Send a success response with the created work package
    res.status(201).json(savedPackage);
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error creating package:', error);
    res.status(500).json({ error: 'An error occurred while creating the package.' });
  }
});

// Get all packages for a given workPackageID
router.get('/fetchPackages/:workPackageID', async (req, res) => {
  try {
    // Get the workPackageID from the request parameters
    const { workPackageID } = req.params;

    // Find all packages for the given workPackageID
    const packages = await Package.find({ workPackageID });

    // Send a success response with the packages
    res.status(200).json(packages);
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error getting packages:', error);
    res.status(500).json({ error: 'An error occurred while getting the packages.' });
  }
});

// Get all packages info (quizzes & materials name, id and subcategory) for a given workPackageID
router.get('/fetchPackagesInfo/:workPackageID', async (req, res) => {
  try {
    // Get the workPackageID from the request parameters
    const { workPackageID } = req.params;

    // Find all packages for the given workPackageID
    const packages = await Package.find({ workPackageID });
  
    // Get materials name given material IDs
    const getMaterialsName = async (materialIDs) => {
      const conn = mongoose.connection;
      const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadFiles' });
      const materialsName = [];
  
      for (const materialID of materialIDs) {
        const file = await bucket.find({ _id: new mongoose.Types.ObjectId(materialID) }).toArray();
        if (file.length != 0) {
          const fileName = file[0].filename;
          materialsName.push(fileName);
        }
        else {
          console.log("file not found");
          // return res.status(201).json({ message: "File not found" });
        }
      }
      return materialsName;
    };
  
    // Get quizzes name given quiz IDs
    const getQuizzesName = async (quizIDs) => {
        const quizzesName = [];
  
        for (const quizID of quizIDs) {
          const quiz = await Quiz.findById(quizID);
          if (quiz != null) {
            const quizName = quiz.name;
            quizzesName.push(quizName);
          }
          else {
              console.log("quiz not found");
              // return res.status(201).json({ message: "Quiz not found" });
          }
        }
        return quizzesName;
    };

    // Get packages info
    const packagePromises = packages.map(async (package) => {
        const packageID = package._id;
        const subcategory = package.subcategory;
        const materials = package.materials;
        const quizzes = package.quizzes;
    
        const materialsName = await getMaterialsName(materials);
        const quizzesName = await getQuizzesName(quizzes);
    
        return { packageID, subcategory, materialsName, quizzesName };
    });
  
    const packagesInfo = await Promise.all(packagePromises);
  
    // Send a success response with the packages
    res.status(200).json(packagesInfo);

  } catch (error) {
    // Handle errors and send an error response
    console.error('Error getting packages:', error);
    res.status(500).json({ error: 'An error occurred while getting the packages.' });
  }
});

// Update a package given its ID
router.put('/update/:packageID', async (req, res) => {
  try {
    // Get the packageID from the request parameters
    const { packageID } = req.params;

    // Get the updated package data from the request body
    const { subcategory, description } = req.body;

    // Find the package by ID and update it
    const updatedPackage = await Package.findByIdAndUpdate(packageID, {
      subcategory,
      description,
    });

    // Send a success response with the updated package
    res.status(200).json(updatedPackage);
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'An error occurred while updating the package.' });
  }
});

// Add content (materials or quizzes) to a package given its ID
router.put('/addContent/:packageID', async (req, res) => {
  try {
    let updatedPackage = '';
    // Get the packageID from the request parameters
    const { packageID } = req.params;

    if (req.body.contentType === 'material') {
      // Get the updated package data from the request body
      const { materials } = req.body;

      // Find the package by ID and update it
      updatedPackage = await Package.findByIdAndUpdate(packageID, {
        materials,
      });
    } else if (req.body.contentType === 'quiz') {
      // Get the updated package data from the request body
      const { quizzes } = req.body;
      // Find the package by ID and update it
      updatedPackage = await Package.findByIdAndUpdate(packageID, {
        quizzes,
      });
    }
    // Send a success response with the updated package
    res.status(200).json(updatedPackage);
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'An error occurred while updating the package.' });
  }
});

// Delete a package given its ID
router.delete('/delete/:packageID', async (req, res) => {
  try {
    // Get the packageID from the request parameters
    const { packageID } = req.params;

    // Find the package by ID and delete it
    const deletedPackage = await Package.findByIdAndDelete(packageID);

    const workpackageID = deletedPackage.workPackageID;
    const updatedWorkpackage = await Workpackage.findById(workpackageID);
    updatedWorkpackage.packageCount = updatedWorkpackage.packageCount - 1;

    await updatedWorkpackage.save();

    // Send a success response with the deleted package
    res.status(200).json(deletedPackage);
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error deleting package:', error);
    res.status(500).json({ error: 'An error occurred while deleting the package.' });
  }
});

// Delete specific content (materials or quizzes) from a package given its package ID and content ID
router.delete('/deleteContent/:contentType/:packageID/:contentID', async (req, res) => {
  try {
    // Get the packageID from the request parameters
    const packageID = req.params.packageID;
    const contentID = req.params.contentID;
    const contentType = req.params.contentType;

    // Find the package by ID and delete the content
    let updatedPackage = '';
    if (contentType === 'material') {
      updatedPackage = await Package.findByIdAndUpdate(
        packageID,
        { $pull: { materials: contentID } },
        { new: true }
      );
    } else if (contentType === 'quiz') {
      updatedPackage = await Package.findByIdAndUpdate(
        packageID,
        { $pull: { quizzes: contentID } },
        { new: true }
      );
    }
    // Send a success response with the updated package
    res.status(200).json(updatedPackage);
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'An error occurred while updating the package.' });
  }
});

// Get all materials for a given package ID
router.get('/fetchMaterials/:packageID', async (req, res) => {
  try {
    // Get the packageID from the request parameters
    const { packageID } = req.params;

    // Find the package by ID
    const foundPackage = await Package.findById(packageID);

    // Check if the package exists
    if (!foundPackage) {
      return res.status(404).json({ error: 'Package not found.' });
    }

    // Get the materials from the found package
    const materials = foundPackage.materials;

    // Send a success response with the materials
    res.status(200).json(materials);
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error getting materials:', error);
    res.status(500).json({ error: 'An error occurred while getting the materials.' });
  }
});

// Get all quizzes for a given package ID
router.get('/fetchQuizzes/:packageID', async (req, res) => {
  try {
    // Get the packageID from the request parameters
    const { packageID } = req.params;

    // Find the package by ID
    const foundPackage = await Package.findById(packageID);

    // Check if the package exists
    if (!foundPackage) {
      return res.status(404).json({ error: 'Package not found.' });
    }

    // Get the quizzes from the found package
    const quizzes = foundPackage.quizzes;

    // Send a success response with the quizzes
    res.status(200).json(quizzes);
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error getting quizzes:', error);
    res.status(500).json({ error: 'An error occurred while getting the quizzes.' });
  }
});

// Get all packages given quiz ID
router.get('/fetchWpByQuizAndPackage/:quizId/:packageId', async (req, res) => {
  try {
    // Get the quizID from the request parameters
    const { quizId, packageId } = req.params;
    // Find all packages for the given quizID and packageID and only return the workPackageID
    const packages = await Package.find({ quizzes: quizId, _id: packageId });
    let wpId = []
    packages.forEach((package) => {
      wpId.push(package.workPackageID);
    });
    // Send a success response with the packages
    res.status(200).json(wpId);
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error getting packages:', error);
    res.status(500).json({ error: 'An error occurred while getting the packages.' });
  }
});

// Get packages count from a workPackage based on workpackage ID
router.get('/fetchPackageCount/:wpId', async (req, res) => {
  try {
    // get wp id
    const { wpId } = req.params;
    // find the workpackage by ID
    const workpackage = await Workpackage.findById(wpId);
    const packageCount = workpackage.packageCount;
    // send success with the package count    
    res.status(200).json(packageCount);
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error getting packages:', error);
    res.status(500).json({ error: 'An error occurred while getting the packages.' });
  }
});

module.exports = router;
