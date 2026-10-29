import speakeasy from "speakeasy";
import qrcode from "qrcode";
import User from "../users/user.model.js";

export const start2FA = async (req, res) => {
  try {
    const user = req.user;
    const accountLabel = user.email || user.username || user.name || "User";
    
    const secret = speakeasy.generateSecret({
      name: `NovaBank:${accountLabel}`,
      issuer: "NovaBank",
      length: 20,
    });

    // Guardar secreto directamente sin disparar validaciones de campos externos
    await User.findByIdAndUpdate(user._id, {
      twoFactorSecret: secret.base32,
    });
    
    const otpAuthUrl = secret.otpauth_url || speakeasy.otpauthURL({
      secret: secret.base32,
      label: `NovaBank:${accountLabel}`,
      issuer: "NovaBank",
      encoding: "base32",
    });

    const qrCode = await qrcode.toDataURL(otpAuthUrl, {
      width: 250,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    res.status(200).json({
      success: true,
      msg: "2FA started successfully",
      qrCode,
      manualEntryKey: secret.base32,
    });
  } catch (error) {
    console.error("Error en start2FA:", error);
    res.status(500).json({
      success: false,
      msg: "Error starting 2FA",
      error: error.message,
    });
  }
};

export const verify2FA = async (req, res) => {
  try {
    const { twoFactorCode } = req.body;
    const user = req.user;

    const freshUser = await User.findById(user._id);

    if (!freshUser || !freshUser.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        msg: "No se ha configurado el 2FA para este usuario",
      });
    }

    const cleanCode = twoFactorCode ? twoFactorCode.toString().trim() : "";
    
    if (cleanCode.length !== 6) {
      return res.status(400).json({
        success: false,
        msg: "El código 2FA debe tener exactamente 6 dígitos",
      });
    }

    // Ventana amplia de 4 pasos (±120 segundos) para compensar desfases de reloj
    const verified = speakeasy.totp.verify({
      secret: freshUser.twoFactorSecret,
      encoding: "base32",
      token: cleanCode,
      window: 4,
      step: 30,
    });

    if (!verified) {
      return res.status(403).json({
        success: false,
        msg: "Código 2FA inválido o expirado",
        hint: "Asegúrate de que el reloj de tu teléfono esté sincronizado automáticamente en Ajustes de fecha/hora.",
      });
    }

    await User.findByIdAndUpdate(user._id, {
      twoFactorEnabled: true,
    });

    res.status(200).json({
      success: true,
      msg: "2FA verificado exitosamente",
    });

  } catch (error) {
    console.error("Error en verify2FA:", error);
    res.status(500).json({
      success: false,
      msg: "Error al verificar 2FA",
      error: error.message,
    });
  }
};
