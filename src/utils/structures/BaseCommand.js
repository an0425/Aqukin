module.exports = class BaseCommand {
    constructor(name, aliases, permission, tag, args, usage){
        this.name = name;
        this.aliases = aliases;
        this.permission = permission;
        this.tag = tag;
        this.args = args;
        this.usage = usage;
    } // end of constructor
} // end of module.exports