import mongoose from "mongoose";

const ModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    releaseYear: {
        type: Number
    }
});

const Model = mongoose.model('Model', ModelSchema);
export default Model;
