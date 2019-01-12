// 'use strict';

// module.exports = function(app) {
//   var Adventurer = app.models.Adventurer;
//   var Role = app.models.Role;
//   var RoleMapping = app.models.RoleMapping;
  
//   Adventurer.find({where: {email: '-'}})
//     .then(adventurer => {
//       let newAdmin = adventurer[0];
      
//       if (!newAdmin) {
//         Adventurer.create([
//           {username: '-', email: '-', password: '-'},
//         ]).then(newAdventurer => {
//           console.log('User was created');
//           newAdmin = newAdventurer[0];
          
//           setRole(newAdmin);
//         });
//       } else {
//         setRole(newAdmin);
//       }
//     });
  
//   function setRole(newAdmin) {
//     Role.find({where: {name: 'admin'}})
//       .then(role => {
//         if (!role.length) {
//           Role.create({name: 'admin'})
//             .then(role => {
//               console.log('Created role:', role);
              
//               giveAdminRights(newAdmin, role);
//             });
//         }
        
//         RoleMapping.find({where: {roleId: role[0].id}})
//           .then(adminRoles => {
//             const alreadyAdmin = adminRoles.some(adRole => {
//               return adRole.principalId == newAdmin.id;
//             });
//             if (alreadyAdmin) {
//               console.log(
//                 `The user ${newAdmin.username} already has admin rights!`
//               );
//             } else {
//               giveAdminRights(newAdmin, role[0]);
//             }
//           });
//       });
//   }
  
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
