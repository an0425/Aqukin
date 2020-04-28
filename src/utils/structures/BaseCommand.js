module.exports = class BaseCommand {
    constructor(name, aliases, permission, tag, isPrivate, args, usage){
        this.name = name;
        this.aliases = aliases;
        this.permission = permission;
        this.tag = tag;
        this.isPrivate = isPrivate;
        this.args = args;
        this.usage = usage;
    }
}