const model = await import('../model/model.js');


export const getUserInfo = async (req, res) => {
    const agentId = req.params.token;
    const agentName = await model.getAgentNameById(agentId);
    res.json({ agentName });
};

// module.exports ={getUserInfo};
