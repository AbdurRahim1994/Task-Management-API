const TaskModel = require('../models/TaskModel')

exports.createTask = (req, res) => {
    const reqBody = req.body;
    const email = req.headers.email

    if (!email) {
        res.status(500).json({ message: "Email not found" })
    }
    else {
        reqBody.email = email;

        // const reqPayload = {
        //     title: req.body.title,
        //     description: req.body.description,
        //     status: req.body.status,
        //     email: email
        // }

        TaskModel.create(reqBody)
            .then((data) => {
                res.status(200).json({ message: "Task successfully created", result: data })
            })
            .catch((error) => {
                res.status(500).json({ message: "Task create failed", result: error })
            })
    }

}

exports.updateTask = (req, res) => {
    const email = req.headers.email;
    if (!email) {
        res.status(500).json({ message: "Email not found" })
    }
    else {
        const { id } = req.params;
        const reqBody = req.body
        TaskModel.updateOne({ _id: id }, reqBody)
            .then((data) => {
                res.status(200).json({ message: "Task successfully updated", result: data })
            })
            .catch((error) => {
                res.status(500).json({ message: "Task update failed", result: error })
            })
    }
}

exports.deleteTask = async (req, res) => {
    const email = req.headers.email
    if (!email) {
        res.status(500).json({ message: "Email not found" })
    }
    else {
        try {
            const { id } = req.params;
            const data = await TaskModel.deleteOne({ _id: id })
            res.status(200).json({ message: "Task deleted successfully", result: data })
        }
        catch (error) {
            res.status(500).json({ message: "Task delete failed", result: error })
        }
    }
}

exports.listOfTaskByStatus = (req, res) => {
    const email = req.headers.email;
    if (!email) {
        res.status(500).json({ message: "Email not found" })
    }
    else {
        const { status } = req.params;
        TaskModel.aggregate([
            { $match: { $and: [{ status: status }, { email: email }] } },
            {
                $project:
                {
                    _id: 1, title: 1, description: 1, status: 1, email: 1, createdDate:
                        { $dateToString: { date: "$createdDate", format: "%d-%m-%Y" } }
                }
            }
        ])
            .then((data) => {
                res.status(200).json({ message: "Successful", result: data })
            })
            .catch((error) => {
                res.status(500).json({ message: "Data not found", result: error })
            })
    }
}

exports.taskStatusCount = (req, res) => {
    const email = req.headers.email;
    if (!email) {
        res.status(500).json({ message: "Email not found" })
    }
    else {
        TaskModel.aggregate([
            { $match: { email: email } },
            { $group: { _id: "$status", total: { $count: {} } } }
        ])
            .then((data) => {
                res.status(200).json({ message: "Successful", result: data })
            })
            .catch((error) => {
                res.status(500).json({ message: "Something went wrong", result: error })
            })
    }
}