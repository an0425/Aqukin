module.exports = class BaseCommand {
    constructor(name, aliases, description, permission, tag, args, usage){
        this.name = name;
        this.aliases = aliases;
        this.description = description;
        this.permission = permission;
        this.tag = tag;
        this.args = args;
        this.usage = usage;
    } // end of constructor
} // end of module.exports