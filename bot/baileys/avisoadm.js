// avisoadm.js
import pkg from '@whiskeysockets/baileys';

const MessageType = pkg.MessageType || pkg['MessageType'] || pkg.default?.MessageType; // Garantir que está acessando corretamente

// Array para armazenar mensagens de promoção
let promotionMessages = [];

// Função para lidar com atualizações de participantes de grupo
export async function handleGroupParticipantsUpdate(c, update, botInfo) {
    console.log('Update recebido:', update); // Depuração

    // Verifica se a ação é uma promoção e se há participantes suficientes
    if (update.action === 'promote' && update.participants.length >= 1) {
        const adminPromoted = update.participants[0]; // O ID do novo administrador
        const adminWhoPromoted = update.author; // O ID de quem fez a promoção

        // Criar mensagem de promoção
        const message = `✅ O usuário @${adminPromoted.split('@')[0]} foi promovido a administrador por @${adminWhoPromoted.split('@')[0]}.`;

        // Enviar mensagem ao grupo
        await c.sendMessage(update.id, {
            text: message,
            mentions: [adminPromoted, adminWhoPromoted],
            quoted: null // Não permitir que a mensagem seja respondida
        });

        // Armazenar mensagem para referência futura
        promotionMessages.push({
            id: update.id,
            message: message,
            promotedBy: adminWhoPromoted,
            promotedUser: adminPromoted
        });

        console.log('Mensagem armazenada:', {
            id: update.id,
            message: message,
            promotedBy: adminWhoPromoted,
            promotedUser: adminPromoted
        }); // Depuração

    } else if (update.action === 'demote' && update.participants.length >= 1) {
        const adminDemoted = update.participants[0]; // O ID do administrador que foi rebaixado
        const adminWhoDemoted = update.author; // O ID de quem fez o rebaixamento

        // Criar mensagem de rebaixamento
        const message = `❌ O usuário @${adminDemoted.split('@')[0]} foi rebaixado de administrador por @${adminWhoDemoted.split('@')[0]}.`;

        // Enviar mensagem ao grupo
        await c.sendMessage(update.id, {
            text: message,
            mentions: [adminDemoted, adminWhoDemoted],
            quoted: null // Não permitir que a mensagem seja respondida
        });

        console.log('Mensagem de rebaixamento enviada:', message); // Depuração
    } else {
        console.log('Ação não é uma promoção ou participantes insuficientes.'); // Depuração
    }
}
