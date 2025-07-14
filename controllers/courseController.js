const courseService = require("../services/courseService");

exports.createCourse = async (req, res, next) => {
    try{
        const result = await courseService.createCourse(req.body, req.user);
        res.status(201).json(result);
    }
    catch(err){
        next(err);
    }
};

exports.updateCourse = async (req, res, next) => {
    try{
        const result = await courseService.updateCourse(req.params.id, req.body, req.user);
        res.json(result);
    }
    catch(err){
        next(err);
    }
};

exports.deleteCourse = async (req, res, next) => {
    try{
        const result = await courseService.deleteCourse(req.params.id, req.user);
        res.json(result);
    }
    catch(err){
        next(err);
    }
};

exports.getAllCourses = async (req, res, next) => {
    try{
        const result = await courseService.getAllCourses();
        res.json(result);
    }
    catch(err){
        next(err);
    }
};

exports.getCourseById = async (req, res, next) => {
    try{
        const result = await courseService.getCourseById(req.params.id);
        res.json(result);
    }
    catch(err){
        next(err);
    }
};

exports.getCoursesByCategory = async (req, res, next) => {
    try{
        const result = await courseService.getCoursesByCategory(req.params.categoryId);
        res.json(result);
    }
    catch(err){
        next(err);
    }
};

exports.getCoursesByInstructor = async (req, res, next) => {
    try{
        const result = await courseService.getCoursesByInstructor(req.params.instructorId);
        res.json(result);
    }
    catch(err){
        next(err);
    }
};

exports.publishCourse = async (req, res, next) => {
    try{
        const result = await courseService.publishCourse(req.params.id, req.user);
        res.json(result);
    }
    catch(err){
        next(err);
    }
};

exports.unpublishCourse = async (req, res, next) => {
    try{
        const result = await courseService.unpublishCourse(req.params.id, req.user);
        res.json(result);
    }
    catch(err){
        next(err);
    }
};