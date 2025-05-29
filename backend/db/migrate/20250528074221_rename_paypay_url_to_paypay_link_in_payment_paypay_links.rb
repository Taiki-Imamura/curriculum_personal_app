class RenamePaypayUrlToPaypayLinkInPaymentPaypayLinks < ActiveRecord::Migration[8.0]
  def change
    rename_column :payment_paypay_links, :paypay_url, :paypay_link
  end
end
