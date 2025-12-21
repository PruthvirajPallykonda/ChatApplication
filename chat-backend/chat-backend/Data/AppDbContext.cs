using Microsoft.EntityFrameworkCore;
using chat_backend.Entities;

namespace chat_backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<User> Users => Set<User>();
        public DbSet<ChatRoom> ChatRooms => Set<ChatRoom>();
        public DbSet<Message> Messages => Set<Message>();
        public DbSet<MessageReaction> MessageReactions { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.UserId);
                entity.HasIndex(u => u.PhoneNumber).IsUnique();
                entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
                entity.Property(u => u.PhoneNumber).IsRequired().HasMaxLength(10);

            });

            //chat

            modelBuilder.Entity<ChatRoom>(entity =>
            {
                entity.HasKey(r => r.Id);

                entity.Property(r => r.Name)
                      .HasMaxLength(100);

                entity.HasOne(r => r.User1)
                      .WithMany(u => u.ChatRoomsAsUser1)
                      .HasForeignKey(r => r.User1Id)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(r => r.User2)
                      .WithMany(u => u.ChatRoomsAsUser2)
                      .HasForeignKey(r => r.User2Id)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            //message
            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasKey(m => m.Id);

                entity.Property(m => m.Text)
                      .IsRequired()
                      .HasMaxLength(1000);

                entity.Property(m => m.FileUrl).HasMaxLength(255);
                entity.Property(m => m.FileName).HasMaxLength(255);
                entity.Property(m => m.FileType).HasMaxLength(100);

                entity.HasOne(m => m.Room)
                      .WithMany(r => r.Messages)
                      .HasForeignKey(m => m.RoomId);

                entity.HasOne(m => m.Sender)
                      .WithMany(u => u.Messages)
                      .HasForeignKey(m => m.SenderId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(m => m.Status)
                      .IsRequired()
                      .HasMaxLength(20);
            });


            modelBuilder.Entity<MessageReaction>()
           .HasIndex(r => new { r.MessageId, r.UserId, r.Emoji })
           .IsUnique(); // one reaction type per user per message

            modelBuilder.Entity<MessageReaction>()
                .HasOne(r => r.Message)
                .WithMany(m => m.Reactions)
                .HasForeignKey(r => r.MessageId);

            modelBuilder.Entity<MessageReaction>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId);

        }
}
}
