// module.exports = function(app) {
//   var Adventurer = app.models.Adventurer;
//   var Role = app.models.Role;
//   var RoleMapping = app.models.RoleMapping;

//   var randomEmail = Math.random() + '@mail.dd';

//   Adventurer.create([
//     {username: 'dm', email: randomEmail, password: 'dm'},
//   ], function(err, adventurers) {
//     if (err) throw err;

//     console.log('Created adventurers:', adventurers);

//     // create the admin role
//     Role.create({
//       name: 'admin',
//     }, function(err, role) {
//       if (err) throw err;

//       console.log('Created role:', role);

//       // make dm an admin
//       role.principals.create({
//         principalType: RoleMapping.USER,
//         principalId: adventurers[0].id,
//       }, function(err, principal) {
//         if (err) throw err;

//         console.log('Created principal:', principal);
//       });
//     });
//   });
// };
