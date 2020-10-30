module.exports = class BaseCommand {
    constructor(name, aliases, description, permission, tag, args, usage, usageEx, patreonOnly){
        this.name = name;
        this.aliases = aliases;
        this.description = description;
        this.permission = permission;
        this.tag = tag;
        this.args = args;
        this.usage = usage;
        this.usageEx = usageEx;
        this.patreonOnly = patreonOnly;
    } // end of constructor
} // end of module.exports