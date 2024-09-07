export const notFound = (req, res) => {
    res.status(404).json({error: 'Route not found'})
}
export const errorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).json({error : 'Ocorreu um erro'})
}
