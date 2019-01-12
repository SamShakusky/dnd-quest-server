// 'use strict';

// module.exports = function(app) {
//   var Adventurer = app.models.Adventurer;
//   var Role = app.models.Role;
//   var RoleMapping = app.models.RoleMapping;
  
//   Adventurer.find({where: {email: '123'}})
//     .then(adventurer => {
//       if (!adventurer.length) {
//         console.log('User does not exist');
//         return false;
//       }
      
//       Role.find({where: {name: 'admin'}})
//         .then(role => {
//           if (!role.length) {
//             Role.create({name: 'admin'})
//               .then(role => {
//                 console.log('Created role:', role);
                
//                 giveAdminRights(adventurer[0], role);
//               });
//           }
          
//           RoleMapping.find({where: {roleId: role[0].id}})
//             .then(adminRoles => {
//               const alreadyAdmin = adminRoles.some(adRole => {
//                 return adRole.principalId == adventurer[0].id;
//               });
//               if (alreadyAdmin) {
//                 console.log(
//                   `The user ${adventurer[0].username} already has admin rights!`
//                 );
//               } else {
//                 giveAdminRights(adventurer[0], role[0]);
//               }
//             });
//         });
//     });
    
//   function giveAdminRights(adventurer, role) {
//     role.principals.create({
//       principalType: RoleMapping.USER,
//       principalId: adventurer.id,
//     }, function(err, principal) {
//       if (err) throw err;

//       console.log(`Admin rights were granted for ${adventurer.username}`);
//     });
//   };
// };
