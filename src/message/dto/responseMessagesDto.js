const humanTalk="\n \nOu digite *0* para esperar um atendende.\n \nOu digite *1* para reiniciar o atendimento."

export const initialClientData="Olá! 👋\n \nSeja bem-vindo ao ${stablishment}!\n \nPara começar informe seu nome."
export const initial="Certo *${name}*\n \nAgora vamos selecionar um serviço!\n \nNossos serviços:\n \n${services}\nSelecione o serviço desejado aqui!"+ humanTalk
export const initialList="Serviço não identificado!\n \nNossos serviços:\n \n${services}\nSelecione o serviço desejado aqui!"+ humanTalk

export const scheduleHour="Agora vamos marcar seu horário! ⏰\n \nEscolha um dia da semana em que deseja agendar.\n \nHorário de funcionamento ${start} - ${end}\n \nInforme no formato: *hh:mm* \nExemplo: *09:35*"+ humanTalk
export const scheduleHourError="Hora informada fora do padrão!\n \nPor favor informe o horário que você deseja agendar seu ${categorie}, funcionamos entre *${start} horas* e *${end} horas*\n \nUtilize o formato: *hh:mm* \nExemplo: *09:35*"+ humanTalk

export const stopMessages="Iremos lhe deixar em mãos humanas por agora, até mais! 👋"

export const emp="Serviço: *${categorie}. ✂️*\n \nSelecione com quem você deseja realizar o serviço!\nOu selecione que não tem preferencia."+ humanTalk

export const selectOnlyHour="Agora vamos selecionar o horário para *${week}*.\n \nInforme a hora desejado, funcionamos entre ${start} e ${end}\n \nInforme no formato: *hh:mm* \nExemplo: *09:35*"+ humanTalk

export const sumary="Seu horário foi agendado com sucesso!\n \n✂️ *Serviço*: ${categorie}${emp}\n⏰ *Horário*: ${week}, ${hour}\n \nEstamos ansiosos para atendê-lo!"+ humanTalk

export const sumary_occupied="Infelizmente, o horário solicitado não está disponível. 😒\n \n*Resumo do Agendamento:*\n \n* 📌 *Categoria*: ${categorie}\n* ⏰ *Horário mais próximo*: ${hour}\n \nAgradecemos pela compreensão!"+ humanTalk

export const nonAvaliable="Sem horas para hoje, tente amanhã"+ humanTalk