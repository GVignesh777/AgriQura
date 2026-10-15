const Alert = require('../database/models/Alert');
const Farmer = require('../database/models/Farmer');

exports.getAlerts = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ user: req.user.id });
    
    // Default smart alerts tailored for demo if no DB records exist yet
    const demoAlerts = [
      {
        _id: 'alert1',
        title: 'Severe Rainfall Warning',
        message: 'Heavy rain (45mm) forecast for Warangal tomorrow. Postpone fertilizer application to prevent runoff.',
        type: 'Weather',
        severity: 'High',
        isRead: false,
        createdAt: new Date(),
      },
      {
        _id: 'alert2',
        title: 'Pink Bollworm Pest Risk',
        message: 'High humidity levels increase risk of Pink Bollworm in flowering Cotton. Inspect flower buds daily.',
        type: 'PestRisk',
        severity: 'High',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 5),
      },
      {
        _id: 'alert3',
        title: 'Cotton Mandi Price Surge',
        message: 'Warangal Market price surged to ₹7,450/quintal (+₹330). Favorable time to sell stored stock.',
        type: 'Market',
        severity: 'Info',
        isRead: true,
        createdAt: new Date(Date.now() - 3600000 * 24),
      }
    ];

    if (!farmer) return res.status(200).json({ success: true, count: demoAlerts.length, alerts: demoAlerts });

    const alerts = await Alert.find({ farmer: farmer._id }).sort({ createdAt: -1 });
    const finalAlerts = alerts.length > 0 ? alerts : demoAlerts;

    res.status(200).json({ success: true, count: finalAlerts.length, alerts: finalAlerts });
  } catch (error) {
    next(error);
  }
};
