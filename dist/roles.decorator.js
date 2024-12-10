"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesDecorator = void 0;
const common_1 = require("@nestjs/common");
const RolesDecorator = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.RolesDecorator = RolesDecorator;
//# sourceMappingURL=roles.decorator.js.map