const Discord = require('discord.js')
const bot = new Discord.Client()
var prefixe = "&"
const fs = require('fs')
const warns = JSON.parse(fs.readFileSync('./warns.json'))

//const command = require('./commands/command')
//const help = require('./commands/help.js')

bot.login(process.env.TOKEN)

bot.on('ready', function() {
	console.log('//////////////////////////////')
	console.log("L'admin auto est connecté")
	console.log('//////////////////////////////')
	bot.user.setActivity('&help', {type : 'WATCHING'}).catch(console.error)
})


bot.on('message', message => {
	if(!message.guild) return
	let args = message.content.trim().split(/ +/g)
	if(message.member.hasPermission("ADMINISTRATOR")){
		if(message.content === prefixe + "help"){
			let helpEmbed = new Discord.RichEmbed()
				.setDescription('Le préfixe du bot est "&", mettez-le au début de chaque commande')
				.setColor("#00FFFF")
				.addField("clear *nombredemessages* : supprime un certain nombre de messages", "unwarn *nomdumembre* : permet d'enlever le dernier warn d'un membre")
				.addField("warn *nomdumembre* *raison* : met un warn (un avertissement) à quelqu'un", "warnslist *nomdumembre* : permet de voir les 10 derniers warns d'un membre")
				.setFooter("Commandes de l'admin auto | by Baggins © | Tous droits réservés")
			message.channel.send(helpEmbed)
		}

		if (args[0].toLowerCase() === prefixe + "clear") {
		let count = args[1]
        if (!count) return message.channel.send("Veuillez indiquer un nombre de messages à supprimer")
        if (isNaN(count)) return message.channel.send("Veuillez indiquer un nombre valide")
        if (count < 1 || count > 100) return message.channel.send("Veuillez indiquer un nombre entre 1 et 100")
        message.channel.bulkDelete(parseInt(count) + 1)
		}

		if (args[0].toLowerCase() === prefixe + 'warn'){
			let member = message.mentions.members.first()
			if (!member) return message.channel.send("Veuillez mentionner un membre")
			let reason = args.slice(2).join(' ')
			if (!reason) return message.channel.send("Veuillez indiquer une raison")
			if (!warns[member.id]) {
				warns[member.id] = []

			}
			warns[member.id].unshift({
				reason: reason,
				date: Date.now,
				mod: message.author.id
			})
			fs.writeFileSync('./warns.json', JSON.stringify(warns))
			message.channel.send(member + " a été warn pour " + reason + " :white_check_mark:")
		}

		if(args[0].toLowerCase() === prefixe + "warnslist") {
			let member = message.mentions.members.first()
			if (!member) return message.channel.send("Veuillez mentionner un membre")
			let warnslistEmbed = new Discord.RichEmbed()
				.setAuthor(member.user.username, member.user.displayAvatarURL)
				.addField('10 derniers warns', ((warns[member.id]) ? warns[member.id].slice(0, 10).map(e => e.reason) : "Ce membre n'a aucun warn"))
				.setTimestamp()
			message.channel.send(warnslistEmbed)
		}

		if (args[0].toLowerCase() === prefixe + "unwarn") {
			let member = message.mentions.members.first()
			if(!member) return message.channel.send("Membre introuvable")
			if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unwarn ce membre.")
			if(member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send("Je ne pas unwarn ce membre.")
			if(!warns[member.id] || !warns[member.id].length) return message.channel.send("Ce membre n'a actuellement aucun warns.")
			warns[member.id].shift()
			fs.writeFileSync('./warns.json', JSON.stringify(warns))
			message.channel.send("Le dernier warn de " + member + " a été retiré :white_check_mark:")
		}

	}

})

bot.on("guildMemberAdd", member  =>{
	member.addRole('579262840662130712')
	member.guild.channels.get('579413780312621115').send("Bienvenue " + member.user + " sur le serveur Minecraft FR ! Tu pourras discuter à propos de Minecraft, suivre l'actualité du jeu et t'amuser avec des fans de ce jeu ! Si tu as besoin d'aide, tu peux contacter un administrateur !")
	console.log('Un nouveau membre a rejoint le serveur et a reçu le grade Villageois')
})

