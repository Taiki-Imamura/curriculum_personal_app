class CreateGroupUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :group_users do |t|
      t.references :group, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.datetime :joined_at

      t.timestamps
    end
  end
end
